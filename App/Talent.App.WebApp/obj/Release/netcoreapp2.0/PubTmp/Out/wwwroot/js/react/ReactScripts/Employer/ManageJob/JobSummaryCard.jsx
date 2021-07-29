import React from "react";
import Cookies from "js-cookie";
import { Popup, Label, Icon, Button } from "semantic-ui-react";
import moment from "moment";

//import "../../../../../../css/MarsTheme.css";

export class JobSummaryCard extends React.Component {
  constructor(props) {
    super(props);
    this.selectJob = this.selectJob.bind(this);
  }

  selectJob(id) {
    var cookies = Cookies.get("talentAuthToken");
    //url: 'http://mycompetitionprojecttalent.azurewebsites.net/listing/listing/closeJob',
  }

  render() {
    return (
      <div className="description job-summary">
        <h2>{this.props.job.title}</h2>
        <Label color="black" ribbon="right">
          <Icon name="user" />
          {this.props.job.noOfSuggestions}
        </Label>
        {this.props.job.location === undefined ? (
          <div></div>
        ) : (
          <div>
            {this.props.job.location.country}, {this.props.job.location.city}
          </div>
        )}
        <div>{this.props.job.summary}</div>
        <div className="description job-summary-whitespace " />
        <span>
          <Button size="mini" color="red">
            Expired
          </Button>
          <Button.Group basic color="blue" size="mini" floated="right">
            <Button>
              <Icon name="close" />
              Close
            </Button>
            <Button>
              <Icon name="edit" />
              Edit
            </Button>
            <Button>
              <Icon name="copy" />
              Copy
            </Button>
          </Button.Group>
        </span>
      </div>
    );
  }
}
