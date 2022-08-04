/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Flex, Item } from '../../Flex';
import Button from '../../Button';

import assign from '../../../common/assign';
import join from '../../../common/join';

import joinFunctions from './joinFunctions';

type TypeFooterProps = {
  isDatePickerFooter?: boolean;
  rootClassName?: string;
  className?: string;
  theme?: string;
  actionEvent?: string;
  centerButtons?: boolean;
  buttonFactory?: () => void | object;

  clearDate?: object;
  okButtonText?: object | string;
  clearButtonText?: object | string;
  cancelButtonText?: object | string;
  todayButtonText?: object | string;

  todayButton?: boolean;
  clearButton?: boolean;
  okButton?: boolean;
  cancelButton?: boolean;
  disabled?: boolean;

  children?: any;

  onTodayClick?: () => void;
  onClearClick?: () => void;
  onOkClick?: () => void;
  onCancelClick?: () => void;

  onClick?: () => void;
  onMouseDown?: () => void;

  renderChildren?: () => void;
  cleanup?: () => void;

  'data-name'?: string;
};

type TypeFooterState = {};

const numbers = [1];
const SPACER = numbers.map((_item, index) => {
  return <Item key={`footer_spacer_${index * 37}`} />;
});

const preventDefault = (e: Event) => e.preventDefault();

export const FooterButton = (props: TypeFooterProps) => {
  const disabledClassName = props.disabled
    ? `${props.rootClassName}-button--disabled`
    : '';

  const cancelButtonClass =
    props.children === 'Cancel' ? `${props.rootClassName}-button-cancel` : '';
  const todayButtonClass =
    props.children === 'Today' ? `${props.rootClassName}-button-today` : '';
  const okButtonClass =
    props.children === 'OK' ? `${props.rootClassName}-button-ok` : '';

  const className = join(
    props.className || '',
    cancelButtonClass,
    todayButtonClass,
    okButtonClass,
    `${props.rootClassName}-button`,
    disabledClassName
  );

  const buttonProps = { ...props };

  delete buttonProps.rootClassName;

  return <Button tabIndex={-1} {...buttonProps} className={className} />;
};

const defaultProps = {
  rootClassName: 'inovua-react-toolkit-calendar__footer',
  actionEvent: 'onClick',
  theme: 'default',

  buttonFactory: FooterButton,

  todayButton: true,
  clearButton: false,
  okButton: true,
  cancelButton: true,

  todayButtonText: 'Today',
  clearButtonText: 'Clear',
  okButtonText: 'OK',
  cancelButtonText: 'Cancel',

  isDatePickerFooter: true,
};

const propTypes = {
  isDatePickerFooter: PropTypes.bool,
  rootClassName: PropTypes.string,
  theme: PropTypes.string,
  actionEvent: PropTypes.string,
  centerButtons: PropTypes.bool,
  buttonFactory: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),

  clearDate: PropTypes.object,
  okButtonText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  clearButtonText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  cancelButtonText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  todayButtonText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),

  todayButton: PropTypes.bool,
  clearButton: PropTypes.bool,
  okButton: PropTypes.bool,
  cancelButton: PropTypes.bool,
  disabled: PropTypes.bool,

  onTodayClick: PropTypes.func,
  onClearClick: PropTypes.func,
  onOkClick: PropTypes.func,
  onCancelClick: PropTypes.func,

  renderChildren: PropTypes.func,
  cleanup: PropTypes.func,
};

class Footer extends Component<TypeFooterProps, TypeFooterState> {
  static defaultProps = defaultProps;
  static propTypes = propTypes;

  p: TypeFooterProps = {};

  render = () => {
    const props = (this.p = assign({}, this.props));

    const { rootClassName } = props;
    const className = join(
      props.className,
      rootClassName,
      `${rootClassName}--theme-${props.theme}`,
      `${rootClassName}--button-cancel`
    );

    const todayButton = this.renderTodayButton();
    const clearButton = this.renderClearButton();

    const okButton = this.renderOkButton();
    const cancelButton = this.renderCancelButton();

    if (!todayButton && !clearButton && !okButton && !cancelButton) {
      return null;
    }

    const middleSpacer = okButton || cancelButton ? SPACER : null;

    const spacer = !props.centerButtons ? middleSpacer : null;

    let children = [
      props.centerButtons && SPACER,

      todayButton,
      clearButton,

      spacer,

      okButton,
      cancelButton,
      props.centerButtons && SPACER,
    ];

    if (props.renderChildren) {
      children = props.renderChildren(children, props);
    }

    const flexProps = assign({}, props);

    delete flexProps.rootClassName;
    delete flexProps.actionEvent;
    delete flexProps.buttonFactory;
    delete flexProps.cancelButton;
    delete flexProps.cancelButtonText;
    delete flexProps.centerButtons;
    delete flexProps.clearDate;
    delete flexProps.cleanup;
    delete flexProps.clearButton;
    delete flexProps.clearButtonText;
    delete flexProps.isDatePickerFooter;
    delete flexProps.onCancelClick;
    delete flexProps.onClearClick;
    delete flexProps.onOkClick;
    delete flexProps.onTodayClick;
    delete flexProps.okButton;
    delete flexProps.okButtonText;
    delete flexProps.selectDate;
    delete flexProps.theme;
    delete flexProps.todayButton;
    delete flexProps.todayButtonText;

    if (typeof props.cleanup == 'function') {
      props.cleanup(flexProps);
    }

    return (
      <Flex
        key="footer"
        inline
        row
        {...flexProps}
        justifyContent="center"
        className={className}
        children={children}
      />
    );
  };

  renderTodayButton = () => {
    if (!this.props.todayButton) {
      return null;
    }

    const theme = this.props.theme;

    return this.renderButton(
      {
        children: this.props.todayButtonText,
        'data-name': 'today-button',
      },
      this.props.onTodayClick!,
      theme!
    );
  };

  renderClearButton = () => {
    if (!this.props.clearButton) {
      return null;
    }

    const theme = this.props.theme;

    return this.renderButton(
      {
        children: this.props.clearButtonText,
        disabled: this.props.clearDate === undefined,
        'data-name': 'clear-button',
      },
      this.props.onClearClick!,
      theme!
    );
  };

  renderOkButton = () => {
    if (!this.props.okButton) {
      return null;
    }

    const theme = this.props.theme;

    return this.renderButton(
      { children: this.props.okButtonText, 'data-name': 'ok-button' },
      this.props.onOkClick!,
      theme!
    );
  };

  renderCancelButton = () => {
    if (!this.props.cancelButton) {
      return null;
    }

    const theme = this.props.theme;

    return this.renderButton(
      { children: this.props.cancelButtonText, 'data-name': 'cancel-button' },
      this.props.onCancelClick!,
      theme!
    );
  };

  renderButton = (props: TypeFooterProps, fn: () => void, theme: string) => {
    let text = props.children;
    let p = props;

    if (typeof props == 'string') {
      p = {};
      text = props;
    }

    if (typeof fn == 'function' && !p.onClick && !p.disabled) {
      p.onClick = fn;
    }

    const Factory: any = this.props.buttonFactory;

    const onMouseDown = p.onMouseDown
      ? joinFunctions(p.onMouseDown, preventDefault)
      : preventDefault;

    return (
      <Factory
        key={`footer_${text}`}
        tabIndex={0}
        {...p}
        rootClassName={this.props.rootClassName}
        onMouseDown={onMouseDown}
        theme={theme}
      >
        {text}
      </Factory>
    );
  };
}

export { TypeFooterProps };
export default Footer;
