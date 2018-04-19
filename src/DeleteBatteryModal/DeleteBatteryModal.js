/****************************************
* Ryan Pencak
* Bucknell University
* © 2018 Ryan Pencak ALL RIGHTS RESERVED
*****************************************/

import './DeleteBatteryModal.css';
import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

export default class DeleteBatteryModal extends Component {

  constructor(props) {
    super(props);

    this.deleteBattery = this.deleteBattery.bind(this);
  }

  // deleteBattery Function: HTTP DELETE Request to server to remove battery with batteryId
  deleteBattery(batteryId) {
    axios.delete('/api/battery/' + batteryId)
      .then(() => {
        this.props.getBatteryData();
      })
      .then(() => {
        this.props.toggleDeleteBatteryModal();
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {

    return (
      // React Bootstrap Modal
      <div className="static-modal">
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Delete Battery</Modal.Title>
          </Modal.Header>

          <Modal.Body>Are you sure you want to delete this battery from the database? All historical data for this battery will be removed.</Modal.Body>

          <Modal.Footer>
            <Button onClick={() => {this.props.toggleDeleteBatteryModal(this.props.selectedBatteryId)}}>Cancel</Button>
            <Button onClick={() => {this.deleteBattery(this.props.selectedBatteryId)}} bsStyle="danger">Delete</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
    )
  }
}
