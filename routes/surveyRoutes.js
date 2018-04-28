const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    //retrieve surveys for current user
    //filter out recipients because the list could be huge and we don't need them
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });

    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    //for every event
    //use Path matcher to attempt to extract surveyId and choice off the pathname extracted
    const p = new Path('/api/surveys/:surveyId/:choice');
    //chain allows us to chain Lodash methods together
    _.chain(req.body)
      .map(({ email, url }) => {
        //extract just the path or route part of the URL
        //if match is an object, then surveyId and choice were matched
        const match = p.test(new URL(url).pathname);
        if (match) {
          return { email, ...match };
        }
      })
      //remove undefined events (those that did not have a match above)
      .compact()
      //de-dupe by email and surveyId
      .uniqBy('email', 'surveyId')
      //update each survey in mongo
      .each(({ surveyId, email, choice }) => {
        //this is asynchronous, but since we don't need to respond to it
        //we don't need any async handlers
        Survey.updateOne(
          {
            //find the survey with the surveyId (mongo id is _id)
            _id: surveyId,
            recipients: {
              //and recipient with the email who has not responded
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            //and update it with this
            //increment the 'yes' or 'no' property by 1
            //es6 - [choice] will be changed to 'yes' or 'no'
            $inc: { [choice]: 1 },
            //and set recipient responded to true
            //($ matches the $elemMatch from above)
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
          //exec actually runs the query
        ).exec();
      })
      .value();

    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      //recipients are comma and space separated so split by comma then trim out spaces
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
