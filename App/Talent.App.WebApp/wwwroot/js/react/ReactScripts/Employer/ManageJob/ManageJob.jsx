import React from "react";
import ReactDOM from "react-dom";
import Cookies from "js-cookie";
import LoggedInBanner from "../../Layout/Banner/LoggedInBanner.jsx";
import { LoggedInNavigation } from "../../Layout/LoggedInNavigation.jsx";
import { JobSummaryCard } from "./JobSummaryCard.jsx";
import { BodyWrapper, loaderData } from "../../Layout/BodyWrapper.jsx";
import {
  Pagination,
  Icon,
  Dropdown,
  Label,
  Checkbox,
  Accordion,
  Form,
  Segment,
} from "semantic-ui-react";

export const filterOptions = [
  {
    text: "Show Active",
    value: "showActive",
  },
  {
    text: "Show Closed",
    value: "showClosed",
  },
  {
    text: "Show Draft ",
    value: "showDraft",
  },
  {
    text: "Show Expired",
    value: "showExpired",
  },
  {
    text: "Show Unexpired",
    value: "showUnexpired",
  },
];

export const sortByDateOption = [
  { text: "Newest Last", value: "asc" },
  { text: "Newest First", value: "desc" },
];

export default class ManageJob extends React.Component {
  constructor(props) {
    super(props);
    let loader = loaderData;
    loader.allowedUsers.push("Employer");
    loader.allowedUsers.push("Recruiter");

    this.state = {
      loadJobs: [],
      loaderData: loader,
      activePage: 1,
      sortBy: {
        date: "asc",
      },
      filter: {
        showActive: true,
        showClosed: false,
        showDraft: true,
        showExpired: true,
        showUnexpired: true,
      },
      totalPages: 1,
      activeIndex: "",
    };
    this.loadData = this.loadData.bind(this);
    this.init = this.init.bind(this);
    this.loadNewData = this.loadNewData.bind(this);
    this.handleFilterOnChange = this.handleFilterOnChange.bind(this);
    //your functions go here
  }

  init() {
    let loaderData = TalentUtil.deepCopy(this.state.loaderData);
    loaderData.isLoading = false;
    // this.setState({ loaderData });//comment this

    // set loaderData.isLoading to false after getting data
    this.loadData(() => this.setState({ loaderData }));

    // console.log(this.state.loaderData)
  }

  componentDidMount() {
    this.init();
  }

  handleFilterOnChange(e, { value }) {
    const data = Object.assign({}, this.state.filter);
    value.forEach((element) => {
      data[element] = true;
    });

    this.setState({
      filter: data,
    });
  }

  handleSortOnChange(e, { value }) {
    const data = Object.assign({}, this.state.sortBy);
    data.date = value;
    this.setState({
      sortBy: data,
    });
  }

  //     let filter = this.state.filter;
  //     let module = {
  //       first: "a",
  //       second: "b",
  //       third: "c",
  //     };
  //     console.log(module);
  //     array1.forEach((element) => {
  //       switch (element) {
  //         case "a":
  //           module.first = "aa";
  //           break;
  //         case "b":
  //           module.first = "bb";
  //           break;
  //       }
  //     });
  //   }

  loadData(callback) {
    var link =
      "http://mycompetitionprojecttalent.azurewebsites.net/listing/listing/getSortedEmployerJobs?activePage=" +
      this.state.activePage +
      "&sortbyDate=" +
      this.state.sortBy.date +
      "&showActive=" +
      this.state.filter.showActive +
      "&showClosed=" +
      this.state.filter.showClosed +
      "&showDraft=" +
      this.state.filter.showDraft +
      "&showExpired=" +
      this.state.filter.showExpired +
      "&showUnexpired=" +
      this.state.filter.showUnexpired +
      "&limit=2";
    var cookies = Cookies.get("talentAuthToken");
    $.ajax({
      url: link,
      headers: {
        Authorization: "Bearer " + cookies,
        "Content-Type": "application/json",
      },
      type: "GET",
      contentType: "application/json",
      dataType: "json",
      success: function (res) {
        if (res.success == true) {
          callback();
          this.setState({ loadJobs: res.myJobs, totalPages: res.totalCount });
        } else {
          TalentUtil.notification.show(res.message, "error", null, null);
        }
      }.bind(this),
    });
  }

  loadNewData(data) {
    var loader = this.state.loaderData;
    loader.isLoading = true;
    data[loaderData] = loader;
    this.setState(data, () => {
      this.loadData(() => {
        loader.isLoading = false;
        this.setState({
          loadData: loader,
        });
      });
    });
  }

  render() {
    return (
      <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
        <section className="page-body">
          <div className="ui container">
            <div className="ui grid">
              <div className="row">
                <div className="sixteen wide left aligned padded column">
                  <h1>List of Job</h1>
                </div>
              </div>
            </div>
            <div className="ui grid">
              <span>
                <Icon name="filter" /> Filter :
                <Dropdown
                  inline
                  multiple
                  selection
                  options={filterOptions}
                  placeholder={"Choose Filter"}
                  onChange={this.handleFilterOnChange.bind(this)}
                />
                <Icon name="calendar alternate" /> Sort By Date :
                <Dropdown
                  inline
                  options={sortByDateOption}
                  defaultValue={this.state.sortBy.date}
                  onChange={this.handleSortOnChange.bind(this)}
                />
              </span>
            </div>
          </div>
          <div className="ui container center aligned job-container">
            {this.state.loadJobs.length === 0 ? (
              <div className="wide left aligned padded column">
                No Jobs Found
              </div>
            ) : (
              this.state.loadJobs.map((job) => <JobSummaryCard job={job} />)
            )}
          </div>
          <div className="ui container center aligned">
            <Pagination totalPages={0} />
          </div>
        </section>
      </BodyWrapper>
    );
  }
}
