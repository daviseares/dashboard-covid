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
// core components
import axios from 'axios';
import { Map, Marker, TileLayer, Popup } from "react-leaflet";
import { FiFrown, FiMeh } from 'react-icons/fi';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import moment from 'moment';
import Select from 'react-select';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';


//functions
import dataGraphic from 'functions/dataGraphic';
import getIconDimension from 'functions/getIconDimension'
import 'leaflet/dist/leaflet.css';

//constants importantes p/data
const options = [{ value: 'exponential', label: 'Exponencial' },
{ value: 'logistico', label: 'Logistico' }]
const limitStartDate = new Date('2019', '10', '30');
const outradata = new Date();
const data = new Date();
const limitFinalDate = data.setDate(outradata.getDate() + 7);

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL
    })
    //this.locale = moment.defineLocale(ptBR);
    this.state = {
      dataLine: null,
      points: [],
      popup: false,
      lastUpdate: null,
      isVisible: false,
      startDate: moment(limitStartDate).format('DD-MM-YYYY'),
      endDate: moment(limitFinalDate).format('DD-MM-YYYY'),
      option: { value: 'exponential', label: 'Exponencial' },
      activeCase: {
        properties: {
          name: "World"
        }
      },
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
    this.getExponencialTotal(this.state.option);
  }

  /**
   * 
   * @param {Object} valueOption | tipo exponencial ou logístico
   */
  getExponencialTotal(valueOption) {
    if (this.state.option !== valueOption) {
      this.setState({ option: valueOption })
    }

    this.api.get(`/${valueOption.value}/total-atual`).then(async (result) => {
      console.log('result:', result)

      var lastUp = new Date(result.data.lastUpdate)

      this.setState({
        points: result.data.data,
        lastUpdate: moment(lastUp).format("DD-MM-YYYY HH:mm:ss"),
        world: result.data.data.filter((value) => {
          return value.properties.name === 'World'

        }),
      })

      var activeCase = result.data.data.filter((value) => {
        return value.properties.name === this.state.activeCase.properties.name

      })
      this.getDataSelecionada(activeCase[0], valueOption)

    }).catch(err => {
      console.log('error-total-atual', err);
    })
  }

  /**
   * 
   * @param {Object} value | pais ativo
   * @param {Object} valueOption | modelo logístico ou exponencial
   */
  getDataSelecionada(value, valueOption) {
    this.setState({ activeCase: value })
    console.log(value)
    this.api.get(`/${valueOption.value}/data-selecionada`, {
      params: {
        idpais: value.properties.idpais,
        startDate: "2019-11-30",
        endDate: "2020-04-10"
      }
    }).then(res => {
      console.log("res----", res);
      var result = dataGraphic(res.data.data);

      console.log("data selecionada", result)

      this.setState({ dataLine: result })
    }).catch(err => {
      console.log(err);
    })
  }

  /**
   * 
   * @param {Object} value 
   * @param {Object} dateRange 
   */
  applyData(value, dateRange) {
    console.log(value, dateRange);
    var sDate = moment(dateRange.startDate).format("DD-MM-YYYY");
    var eDate = moment(dateRange.endDate).format("DD-MM-YYYY");

    this.setState({ startDate: sDate, endDate: eDate })

  }

  toggleModal() {
    this.setState({ isVisible: !this.state.isVisible })
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
                        <CardTitle tag="p">{(this.state.world[0].properties.confirmed).toLocaleString('pt-BR')}</CardTitle>
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
                        <i className="nc-icon nc-globe text-info" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">{this.state.world[0].properties.day}</p>
                        <CardTitle tag="p">{(this.state.world[0].properties.estimate_cases).toLocaleString('pt-BR')}</CardTitle>
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
                        <FiFrown color="red" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">{this.state.world[0].properties.day}</p>
                        <CardTitle tag="p">{(this.state.world[0].properties.deaths).toLocaleString('pt-BR')}</CardTitle>
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
                        <FiMeh color="#b293f9" />
                      </div>
                    </Col>
                    <Col md="8" xs="7">
                      <div className="numbers">
                        <p className="card-category">{this.state.world[0].properties.day}</p>
                        <CardTitle tag="p">{(this.state.world[0].properties.estimate_deaths).toLocaleString('pt-BR')}</CardTitle>
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
            <Col className="text-center">
              <h5>Monitoramento geográfico da projeçao da COVID-19 para os próximos 7 dias</h5>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Mapa do Mundo</CardTitle>
                  <p className="text-secondary">
                    {(this.state.lastUpdate) &&
                      "Última Atualização às " + this.state.lastUpdate
                    }
                  </p>
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
                      this.state.points.map((value) => (
                        value.properties.name !== 'World' ?
                          <Marker
                            onmouseover={() => this.setState({ popup: value })}
                            onmouseout={() => this.setState({ popup: false })}
                            icon={getIconDimension(value.properties.estimate_cases)}
                            key={value.properties.idpais}
                            position={[value.geometry.coordinates[1], value.geometry.coordinates[0]]}
                            onclick={() => this.getDataSelecionada(value, this.state.option)}
                          />
                          : null
                      ))
                      :
                      null
                    }
                  </Map>
                </CardBody>
                <CardFooter>
                  {/* <div className="stats" styles={{ color: "#000" }}>
                    <i className="fa fa-history" /> Updated 3 minutes ago
                  </div> */}
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md="4">
              <Card>
                <CardHeader>
                  <CardTitle tag="h5">Projeções</CardTitle>
                  <p className="card-category">Selecione o modelo</p>
                </CardHeader>
                <CardBody>
                  <Select
                    id="select-type"
                    placeholder="Selecione o modelo"
                    onChange={(value) => this.getExponencialTotal(value)}
                    options={options}
                  />
                  <Row>
                    <Col style={{ textAlign: "center", fontSize: 16, fontWeight: "600", color: "#555", marginTop: 20 }}>
                      {this.state.startDate + " até " + this.state.endDate}
                    </Col>
                  </Row>
                  <DateRangePicker
                    locale={{
                      cancelLabel: "Cancelar",
                      format: "DD/MM/YYYY",
                      applyLabel: "OK",
                      monthNames: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                      daysOfWeek: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]
                    }}
                    minDate={limitStartDate}
                    maxDate={limitFinalDate}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    onApply={(value, dateRange) => this.applyData(value, dateRange)}
                    containerStyles={{ width: "100%", marginTop: 15 }}
                  >
                    <Button color="text-info" style={{ width: "100%" }}>Selecionar Data</Button>
                  </DateRangePicker>
                  <Button color="success" style={{ width: "100%", marginTop: 10 }}>buscar</Button>
                </CardBody>
                <CardFooter>
                  <div className="stats">
                    {/* <i className="fa fa-calendar" /> Number of emails sent */}
                  </div>
                </CardFooter>
              </Card>
            </Col>
            <Col md="8">
              <Card className="card-chart">
                <CardHeader>
                  <CardTitle tag="h5">{this.state.activeCase.properties.name}</CardTitle>
                  <p className="card-category">Modelo {this.state.option.label}</p>
                </CardHeader>
                <CardBody>
                  {
                    this.state.dataLine ?
                      <Line
                        data={this.state.dataLine.data}
                        options={this.state.dataLine.options}
                        width={400}
                        height={150}
                      />
                      : null
                  }

                </CardBody>
                <CardFooter>
                  <Row className="chart-legend row">
                    <Col lg="6" xs="12" className="text-center">
                      <i className="fa fa-circle text-info" /> Casos Estimados&nbsp;&nbsp;&nbsp;{" "}
                      <i className="fa fa-circle text-warning" /> Casos Confirmados
                    </Col>
                    <Col lg="6" xs="12" className="mt-3 text-center mt-lg-0">
                      <Button style={{ backgroundColor: "#555" }}
                        className="btn-sm ml-lg-5" onClick={() => this.toggleModal()}>
                        expandir modal
                      </Button>
                    </Col>
                  </Row>
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Modal isOpen={this.state.isVisible} toggle={() => this.toggleModal()} className="modal-dialog modal-xl">
            <ModalHeader toggle={() => this.toggleModal()}>
              {this.state.activeCase.properties.name} - Modelo {this.state.option.label}{" " + this.state.startDate + " até " + this.state.endDate}
            </ModalHeader>
            <ModalBody>
              {
                this.state.dataLine ?
                  <Line
                    data={this.state.dataLine.data}
                    options={this.state.dataLine.options}
                    width={"100%"}
                    height={"40%"}
                  />
                  : null
              }
            </ModalBody>
          </Modal>
        </div>
      </>
    );
  }
}

export default Dashboard;
