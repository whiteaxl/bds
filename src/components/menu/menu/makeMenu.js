const TimerMixin = require('react-timer-mixin');
import {View} from 'react-native';
import {UIManager} from 'react-native';


module.exports = (React, { constants, model, styles }) => {

  const Menu = React.createClass({
    displayName: 'Menu',
    propTypes: {
      name: React.PropTypes.string,
      onSelect: React.PropTypes.func,
      onOpen: React.PropTypes.func,
      onClose: React.PropTypes.func
    },
    getDefaultProps() {
      return {
        onSelect: () => {},
        onOpen: () => {},
        onClose: () => {}
      };
    },
    contextTypes: {
      menuController: model.IMenuController
    },
    childContextTypes: {
      getClosestMenuName: React.PropTypes.func
    },
    getChildContext() {
      return { getClosestMenuName: () => this._name };
    },
    componentWillMount() {
      this._name = this.props.name || this.context.menuController.makeName();
    },
    componentWillUnmount() {
      this.context.menuController.unregisterMenu(this._name);
    },
    getName() {
      return this._name;
    },
    onLayout() {
      this.context.menuController.registerMenu(this._name, {
        ref: this.refs.Menu,
        didOpen: () => this.didOpen(),
        didClose: () => this.didClose()
      });
    },
    onSelect(value) {
      // Call `onSelect` and close the menu, unless the callback returns `false`.
      const shouldClose = this.props.onSelect(value) !== false;
      if (shouldClose) {
        this.context.menuController.close();
      }
    },
    didOpen() {
      this.props.onOpen();
    },
    didClose() {
      this.props.onClose();
    },
    render() {
      const { children } = this.props;

      if (!Array.isArray(children)) {
        throw new Error('Menu component is missing required children components MenuTrigger and MenuOptions.')
      }

      const { rest, options } = children.reduce((accum, child) => {
        switch (child.type.displayName) {
          case 'MenuOptions':
            if (accum.options) {
              throw new Error('Menu component has two MenuOptions children, but it can only use one. Please remove one of them.')
            }
            accum.options = React.cloneElement(child, {onSelect: this.onSelect});
            break;
          default:
            accum.rest.push(child);
        }
        return accum;
      }, {options: null, rest: []});

      if (!options) {
        throw new Error('Menu component is missing required child component MenuOptions.')
      }

      this.context.menuController.registerOptionsElement(this._name, options);

      return (
        <View style={this.props.style} ref="Menu" onLayout={this.onLayout}>
          { rest }
        </View>
      );
    }
  });

  return Menu;
};