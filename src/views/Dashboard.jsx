/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col
} from "reactstrap";
import axios from 'axios';
import { Map, Marker, TileLayer, Popup } from "react-leaflet";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart
} from "variables/charts.jsx";
//functions
import dataGraphic from 'functions/dataGraphic';
import getIconDimension from 'functions/getIconDimension'
import 'leaflet/dist/leaflet.css';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.api = axios.create({
      baseURL: 'http://191.234.168.25:3000'
    })

    this.state = {
      dataLine: null,
      points: [],
      popup: false,
      world: [{
        properties: {
          idpais: 196,
          name: "World",
          day: "3-04-2020",
          confirmed: 1014296,
          recovered: 0,
          deaths: 52982,
          pessimistic: 1327953,
          optimistic: 868771,
          estimate_cases: 1098362,
          estimate_deaths: 57373
        }
      }]
    }
  }

  componentDidMount() {
    //this.getDataSelecionada();
    this.getExponencialTotal();
  }


  getExponencialTotal() {
    try {

      this.api.get(`/exponential/total-atual`).then(async (result) => {
        console.log('result:', result)
        this.setState({
          world: result.data.data.filter((value) => {
            return value.properties.name === 'World'

          })
        })
        console.log('Wordl', this.state.world)
        this.setState({
          points: result.data.data
        })
      })


      //console.log(`/${selectedOption.value}/total-atual`, result[0]);


      //getFilterData(result[0]);
      //setActiveCase(result[0]);
      //setPointslJson();



    } catch (err) {
      console.log("Erro GetExponencialTotalAtual", err)
    }
  }


  getDataSelecionada() {
    this.api.get('/exponential/data-selecionada', {
      params: {
        idpais: 196,
        startDate: "2019-11-30",
        endDate: "2020-04-10"
      }
    }).then(res => {
      console.log(res);
      var result = dataGraphic(res.data.data);

      console.log(result)

      this.setState({ dataLine: result })
    }).catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      <>
        <div className="content">
          <Row>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-globe text-warning" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">{this.state.world[0].properties.day}</p>
                        <CardTitle tag="p">{this.state.world[0].properties.confirmed}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div>
                    <b styles="backgroud-color:red;font-weight:800">Casos Confirmados </b>
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-money-coins text-info" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">{this.state.world[0].properties.day}</p>
                        <CardTitle tag="p">{this.state.world[0].properties.estimate_cases}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div>
                    <b styles="backgroud-color:red;font-weight:800"> Casos Estimados </b>
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-vector text-danger" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">{this.state.world[0].properties.day}</p>
                        <CardTitle tag="p">{this.state.world[0].properties.deaths}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div>
                    <b styles="backgroud-color:red;font-weight:800"> Mortes </b>
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col lg="3" md="6" sm="6">
              <Card className="card-stats">
                <CardBody>
                  <Row>
                    <Col md="4" xs="5">
                      <div className="icon-big text-center icon-warning">
                        <i className="nc-icon nc-favourite-28 text-secondary" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">{this.state.world[0].properties.day}</p>
                        <CardTitle tag="p">{this.state.world[0].properties.estimate_deaths}</CardTitle>
                        <p />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div>
                    <b styles="backgroud-color:red;font-weight:800">Estimativa de Mortes</b>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Users Behavior</CardTitle>
                  <p className="card-category">24 Hours performance</p>
                </CardHeader>
                <CardBody>
                  <Map
                    worldCopyJump={true}
                    minZoom={2}
                    center={[23.6746072, 11.1025824]}
                    zoom={1.5}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {(this.state.popup) && (
                      <Popup
                        position={[
                          this.state.popup.geometry.coordinates[1],
                          this.state.popup.geometry.coordinates[0]
                        ]}
                      >
                        <div>
                          <h3 className="txtPopup">{this.state.popup.properties.name} </h3>
                          <p className="txtPopup">Data: <b>{this.state.popup.properties.day}</b></p>
                          <p className="txtPopup">{this.state.popup.properties.region === "World" ? null : 'Região: ' + this.state.popup.properties.region}</p>
                          <p className="colorYellow txtPopup">Confirmados: <b>{this.state.popup.properties.confirmed}</b></p>
                          <p className="colorRed txtPopup">Mortes: <b>{this.state.popup.properties.deaths}</b></p>
                          <p className="colorPurple txtPopup">Estimate de Casos: <b>{this.state.popup.properties.estimate_cases}</b></p>
                          <p className="colorVine txtPopup">Estimativa de Mortes: <b>{this.state.popup.properties.estimate_deaths}</b></p>
                          {/*  <p className="colorGreen"> Recuperados: <b>{activeCase.properties.Recovered}</b></p> */}
                          {/*  <p className="colorRed">Mortes: <b>{activeCase.properties.Deaths}</b> </p> */}
                        </div>
                      </Popup>
                    )}

                    {this.state.points !== undefined && this.state.points != null ?
                      this.state.points.map((value, index) => (
                        value.properties.name !== 'World' ?
                          <Marker
                            onmouseover={() => this.setState({ popup: value })}
                            onmouseout={() => this.setState({ popup: false })}
                            icon={getIconDimension(value.properties.estimate_cases)}
                            key={index}
                            position={[value.geometry.coordinates[1], value.geometry.coordinates[0]]}
                          //onclick={() => selectCountry(value)}
                          />
                          : null
                      ))
                      :
                      null
                    }
                  </Map>
                </CardBody>
                <CardFooter>
                  <hr />
                  <div className="stats" styles={{ color: "#000" }}>
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Email Statistics</CardTitle>
                  <p className="card-category">Last Campaign Performance</p>
                </CardHeader>
                <CardBody>
                  <Pie
                    data={dashboardEmailStatisticsChart.data}
                    options={dashboardEmailStatisticsChart.options}
                  />
                </CardBody>
                <CardFooter>
                  <div className="legend">
                    <i className="fa fa-circle text-primary" /> Opened{" "}
                    <i className="fa fa-circle text-warning" /> Read{" "}
                    <i className="fa fa-circle text-danger" /> Deleted{" "}
                    <i className="fa fa-circle text-gray" /> Unopened
                  </div>
                  <hr />
                  <div className="stats" styles={{ color: "#000" }}>
                    <i className="fa fa-calendar" /> Number of emails sent
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col md="8">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h5">NASDAQ: AAPL</CardTitle>
                  <p className="card-category">Line Chart with Points</p>
                </CardHeader>
                <CardBody>
                  {
                    this.state.dataLine ?
                      <Line
                        data={this.state.dataLine.data}
                        options={this.state.dataLine.options}
                        width={400}
                        height={100}
                      />
                      : null
                  }

                </CardBody>
                <CardFooter>
                  <div className="chart-legend">
                    <i className="fa fa-circle text-info" /> Tesla Model S{" "}
                    <i className="fa fa-circle text-warning" /> BMW 5 Series
                  </div>
                  <hr />
                  <div className="card-stats">
                    <i className="fa fa-check" /> Data information certified
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
