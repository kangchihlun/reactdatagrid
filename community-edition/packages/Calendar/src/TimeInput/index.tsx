/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component, createRef, RefObject } from 'react';
import PropTypes from 'prop-types';
import raf from '../../../../common/raf';
import assign from '../../../../common/assign';

import Clock from '../Clock';

import getSelectionStart from './getSelectionStart';
import getSelectionEnd from './getSelectionEnd';
import setCaretPosition from './setCaretPosition';
import getNewValue from './getNewValue';
import toTimeValue from './toTimeValue';
import {
  TypeTimeInputProps,
  TypeTimeInputState,
  TypeRange,
  TypeCaretPosition,
} from './types';
import cleanProps from '../../../../common/cleanProps';

const defaultProps = {
  theme: 'default',
  circular: true,
  propagate: true,
  incrementNext: true,
};

const propTypes = {
  theme: PropTypes.string,
  circular: PropTypes.bool,
  propagate: PropTypes.bool,
  incrementNext: PropTypes.bool,
  format: PropTypes.string,
  timeFormat: PropTypes.string,
  value: (props: TypeTimeInputProps, propName: string) => {
    if (props[propName as keyof TypeTimeInputProps] !== undefined) {
      console.warn(
        'Due to performance considerations, TimeInput will only be uncontrolled.'
      );
    }
  },
};
class TimeInput extends Component<TypeTimeInputProps, TypeTimeInputState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  private timeInputRef: RefObject<unknown>;
  private p: TypeTimeInputProps = {};
  private updateCallback?: (() => void) | null;

  constructor(props: TypeTimeInputProps) {
    super(props);
    const format = props.format || props.timeFormat;

    this.timeInputRef = createRef();

    if (
      format!.indexOf('hh') != 0 &&
      format!.indexOf('HH') != 0 &&
      format!.indexOf('kk') != 0
    ) {
      console.warn('Please start your time format with 2 digit hours.');
    }

    let hours24 = true;
    let meridiem = format!.indexOf('a') != -1 || format!.indexOf('A') != -1;

    if (format!.indexOf('hh') == 0 && format!.indexOf('kk') == 0) {
      hours24 = false;
    }

    const separator =
      props.separator || (format && format.length > 2)
        ? format!.charAt(2)
        : ':';
    const hasSeconds = format!.indexOf('ss') != -1;

    if (hasSeconds && format!.charAt(5) != separator) {
      console.warn(
        'Expected minutes-seconds separator to be same as hours-minutes separator. (at position 5)'
      );
    }

    let defaultValue = `00${separator}00`;

    if (hasSeconds) {
      defaultValue += `${separator}00`;
    }
    if (meridiem) {
      defaultValue += ' am';
    }

    this.state = {
      valueRange: props.valueRange || 0,
      separator,
      hours24,
      meridiem,
      value: props.defaultValue || defaultValue,
    };
  }

  render = () => {
    const props = (this.p = assign({}, this.props));
    props.value = this.state.value;

    const domProps = cleanProps(props, TimeInput.propTypes);

    return (
      <input
        {...domProps}
        ref={this.timeInputRef}
        defaultValue={undefined}
        value={props.value}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
      />
    );
  };

  onKeyDown = (event: KeyboardEvent): void => {
    const value = this.p.value;

    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }

    const range: TypeRange = this.getSelectedRange();
    const separator = this.props.separator || this.state.separator || ':';

    const { value: newValue, update, caretPos } = getNewValue({
      range,
      event,

      circular: this.props.circular,
      propagate: this.props.propagate,

      oldValue: value,
      separator,
      meridiem: this.state.meridiem,
      hours24: this.state.hours24,
      incrementNext: this.props.incrementNext,
    });

    const updateCaretPos = (): void => {
      if (caretPos != undefined) {
        this.setCaretPosition(caretPos);
      }
    };

    if (update || caretPos) {
      event.preventDefault();
    }

    if (update) {
      this.setValue(newValue, updateCaretPos);
    } else {
      raf(updateCaretPos);
    }
  };

  getInput = () => {
    return this.timeInputRef.current;
  };

  setCaretPosition = (pos: TypeCaretPosition): void => {
    const dom = this.getInput();
    dom && setCaretPosition(dom, pos);
  };

  setValue = (value: string | undefined, callback?: any) => {
    this.setState(
      {
        now: Date.now(),
        value,
      },
      typeof callback == 'function' && callback
    );

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  componentDidUpdate() {
    if (this.updateCallback) {
      this.updateCallback();
      this.updateCallback = null;
    }
  }

  getSelectedRange = (): TypeRange => {
    const dom = this.getInput();

    return {
      start: getSelectionStart(dom),
      end: getSelectionEnd(dom),
    };
  };

  getSelectedValue = (): string => {
    const range = this.getSelectedRange();
    const value = this.p.value;

    return value!.substring(range.start, range.end);
  };

  onChange = (event: any): string => {
    event.stopPropagation();
    const value = event.target.value;
    return value;
  };

  onTimeChange = (value: string) => {
    const time: string[] = value.split(':');

    this.setState({
      minutes: (time[0] as any) * 60 + time[1],
    });
  };

  renderClock = () => {
    const props = this.p;
    const clock = props.children.filter(
      (child: any) => child && child.props && child.props.isTimePickerClock
    )[0];

    const clockProps = {
      time: this.state.minutes || props.date,
      showSecondsHand: true,
    };

    if (clock) {
      return React.cloneElement(clock, clockProps);
    }

    return <Clock {...clockProps} />;
  };
}

export { TypeTimeInputProps, TypeRange };
export {
  getSelectionStart,
  getSelectionEnd,
  getNewValue,
  setCaretPosition,
  toTimeValue,
};
export default TimeInput;
