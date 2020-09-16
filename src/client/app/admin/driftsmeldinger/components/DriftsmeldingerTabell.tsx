import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import Image from 'sharedComponents/Image';
import removeIcon from 'images/remove.svg';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { CheckboxField } from 'form/FinalFields';
import { Checkbox } from 'nav-frontend-skjema';
import { getDateAndTime } from 'utils/dateUtils';
import driftsmeldingPropType from '../driftsmeldingPropType';
import { Driftsmelding } from '../driftsmeldingTsType';

import styles from './driftsmeldingerTabell.less';
import SletteDriftsmeldingerModal from './SletteDriftsmeldingerModal';

const headerTextCodes = [
  'DriftsmeldingTabell.Tekst',
  'DriftsmeldingTabell.Aktiv',
  'DriftsmeldingTabell.Dato',
];

interface TsProps {
  driftsmeldinger: Driftsmelding[];
  fjernDriftsmelding : (id: string) => Promise<string>;
  switchDriftsmelding : (id: string, isChecked: boolean) => Promise<string>;
}

interface StateTsProps {
  valgtDriftsmelding?: Driftsmelding;
  showSlettModal: boolean;
}

/**
 * DriftsmeldingerTabell
 */
export class DriftsmeldingerTabell extends Component<TsProps, StateTsProps> {
  static propTypes = {
    driftsmeldinger: PropTypes.arrayOf(driftsmeldingPropType).isRequired,
    fjernDriftsmelding: PropTypes.func.isRequired,
    switchDriftsmelding: PropTypes.func.isRequired,
  };

  constructor(props: TsProps) {
    super(props);

    this.state = {
      valgtDriftsmelding: undefined,
      showSlettModal: false,
    };
  }

  showSletteDriftsmeldingModal = (driftsmelding: Driftsmelding) => {
    this.setState((prevState) => ({ ...prevState, showSlettModal: true }));
    this.setState((prevState) => ({ ...prevState, valgtDriftsmelding: driftsmelding }));
  }

  closeSletteModal = () => {
    this.setState((prevState) => ({ ...prevState, showSlettModal: false }));
    this.setState((prevState) => ({ ...prevState, valgtDriftsmelding: undefined }));
  }

  fjernDriftsmelding = (valgtDriftsmelding: Driftsmelding) => {
    const {
      fjernDriftsmelding,
    } = this.props;
    fjernDriftsmelding(valgtDriftsmelding.id);
    this.closeSletteModal();
  }

  handleClick = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      switchDriftsmelding,
    } = this.props;
    switchDriftsmelding(id, e.target.checked);
  }

  render = () => {
    const {
      driftsmeldinger, switchDriftsmelding,
    } = this.props;
    const {
      valgtDriftsmelding, showSlettModal,
    } = this.state;

    const sorterteDriftsmeldinger = driftsmeldinger.sort((d1, d2) => d1.dato.localeCompare(d2.dato));

    return (
      <>
        <Element><FormattedMessage id="DriftsmeldingerTabell.Driftsmeldinger" /></Element>
        {sorterteDriftsmeldinger.length === 0 && (
          <>
            <VerticalSpacer eightPx />
            <Normaltekst><FormattedMessage id="DriftsmeldingerTabell.IngenDriftsmeldinger" /></Normaltekst>
            <VerticalSpacer eightPx />
          </>
        )}
        {sorterteDriftsmeldinger.length > 0 && (
        <Table headerTextCodes={headerTextCodes} noHover>
          {sorterteDriftsmeldinger.map((driftsmelding) => (
            <TableRow key={driftsmelding.id}>
              <TableColumn>{driftsmelding.melding}</TableColumn>
              <TableColumn>
                <div className={styles.checkBox}>
                  <Checkbox

                    label=""
                    checked={driftsmelding.aktiv}
                    onChange={(e) => this.handleClick(driftsmelding.id, e)}
                    name="aktiv"
                  />
                </div>
              </TableColumn>
              <TableColumn>
                <FormattedMessage
                  id="DriftsmeldingerTabell.Dato"
                  values={{
                    ...getDateAndTime(driftsmelding.dato),
                    b: (...chunks) => <b>{chunks}</b>,
                  }}
                />
              </TableColumn>
              <TableColumn>
                <Image
                  src={removeIcon}
                  className={styles.removeImage}
                  onMouseDown={() => this.showSletteDriftsmeldingModal(driftsmelding)}
                  onKeyDown={() => this.showSletteDriftsmeldingModal(driftsmelding)}
                  tabIndex={0}
                />
              </TableColumn>
            </TableRow>
          ))}
        </Table>
        )}
        {showSlettModal && (
        <SletteDriftsmeldingerModal
          valgtDriftsmelding={valgtDriftsmelding}
          closeSletteModal={this.closeSletteModal}
          fjernDriftsmelding={this.fjernDriftsmelding}
        />
        )}
      </>
    );
  }
}

export default DriftsmeldingerTabell;
