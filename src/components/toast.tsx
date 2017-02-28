import * as React from 'react'
import {
  StyleSheet,
  View,
  ViewStyle,
  Animated,
  Dimensions,
  Text,
  Platform
} from 'react-native'
// tslint:disable-next-line
const Icon = require('react-native-vector-icons/FontAwesome')

const { height, width } = Dimensions.get('window')

interface IProps {
  entry?: 'top' | 'bottom',
  position?: 'top' | 'center' | 'bottom',
  duration?: number,
  timeout?: number,
  text?: string,
  kind?: styleType,
  visible: boolean
}

type styleType = 'success' | 'info' | 'warning' | 'error'

interface IState {
  visable: boolean,
  slideAnim: Animated.Value,
}

const NAVBAR_HEIGHT = Platform.OS === 'ios' ? 64 : 32

class Toast extends React.Component<IProps, IState> {
  public static defaultProps: IProps = {
    entry: 'top',
    position: 'top',
    duration: 300,
    timeout: 2300,
    text: '',
    kind: 'success',
    visible: false
  }
  private timer: number

  constructor (props: IProps) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(-NAVBAR_HEIGHT),
      visable: false
    }
  }

  componentWillUnmount() {
    this.clearTimer()
  }

  componentWillReceiveProps(nextProps: IProps) {
    this.show()
  }

  public show () {
    this.clearTimer()

    if (this.state.visable) {
      this.hide()
    }
    this.setState({
      visable: true
    } as IState)

    const { duration, timeout } = this.props

    this.animation().start()

    this.timer = setTimeout(() => {
      this.animation(-NAVBAR_HEIGHT).start(() => {
        this.setState({
          visable: false
        } as IState)
      })
    }, timeout - duration)
  }

  public hide () {
    this.setState({
      visable: false
    } as IState)
    this.state.slideAnim.setValue(-NAVBAR_HEIGHT)
  }

  render () {
    const visible = this.state.visable
    const transform = {transform: [{translateY: this.state.slideAnim}]}

    return visible ?
      <View
        style={styles.container}
      >
        <Animated.View
          style={[typeStyleFilter(this.props.kind), styles.wrapper, transform]}
        >
          <View style={{position: 'absolute', left: 15}}>
            <Icon size={17} color={'white'} name={this.iconNameFilter()}/>
          </View>
          <Text style={[{ color: 'white' }]}>{this.props.text}</Text>
        </Animated.View>
      </View> :
      null
  }

  private iconNameFilter () {
    switch (this.props.kind) {
      case 'success':
        return 'check-circle'
      case 'info':
        return 'info-circle'
      case 'warning':
        return 'exclamation-circle'
      case 'error':
        return 'times-circle'
      default:
        return null
    }
  }

  private clearTimer () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  private animation (toValue = 0) {
    const { duration } = this.props
    return Animated.timing(this.state.slideAnim, {
      duration,
      toValue
    })
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    // zIndex: 9999,
    width,
    height: 64
  } as ViewStyle,
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  } as ViewStyle,
  success: {
    backgroundColor: 'rgba(81, 163, 81, 0.9)'
  } as ViewStyle,
  info: {
    backgroundColor: '#2f96b4'
  } as ViewStyle,
  warning : {
    backgroundColor: '#f89406'
  } as ViewStyle,
  error: {
    backgroundColor: '#bd362f'
  } as ViewStyle
})


/** 
 * [TODO]
 * I can't get "styles[this.state.type]" through
 * TypeScript validation
 */
function typeStyleFilter (stype?: styleType) {
  switch (stype) {
    case 'success':
      return styles.success
    case 'info':
      return styles.info
    case 'warning':
      return styles.warning
    case 'error':
      return styles.error
    default:
      return styles.success
  }
}

export default Toast
