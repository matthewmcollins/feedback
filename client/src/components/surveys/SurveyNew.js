// SurveyNew shows SurveyForm and SurveyFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import SurveyForm from './SurveyForm';
import SurveyFormReview from './SurveyFormReview';

class SurveyNew extends Component {
  //babel shortcut from create react app that let's us initialize state
  //this is the same as doing it in the constructor
  state = { showReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <SurveyFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }

    return (
      <SurveyForm
        onSurveySubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

//use reduxForm here so that the form values get cleared out (by default they get cleared out)
//the SurveyForm reduxForm call retains them with destroyOnUnmount: false, so we need this call here to unload them when the
//SurveyNew form is unmounted (ie, when cancel is clicked or the user navigates away with a header link)
//without this call, when the user hits cancel on SurveyFormReview, and then added again, their old form values would be there
export default reduxForm({ form: 'surveyForm' })(SurveyNew);
