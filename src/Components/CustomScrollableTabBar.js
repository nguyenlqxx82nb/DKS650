const React = require('react');
const { ViewPropTypes } = ReactNative = require('react-native');
const PropTypes = require('prop-types');
const createReactClass = require('create-react-class');
const {
  View,
  Animated,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Dimensions,
} = ReactNative;
//const Button = require('./Button');
import Button from './ListItem';

const WINDOW_WIDTH = Dimensions.get('window').width;

const CustomScrollableTabBar = createReactClass({
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    scrollOffset: PropTypes.number,
    style: ViewPropTypes.style,
    tabStyle: ViewPropTypes.style,
    tabsContainerStyle: ViewPropTypes.style,
    tabContainerStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    renderTab: PropTypes.func,
    underlineStyle: ViewPropTypes.style,
    onScroll: PropTypes.func,
    isTabRound : PropTypes.bool,
    rippleColor : PropTypes.string,
    tabWidth : PropTypes.number
  },

  getDefaultProps() {
    return {
      scrollOffset: 52,
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
      style: {},
      tabStyle: {},
      tabsContainerStyle: {},
      tabContainerStyle:{},
      underlineStyle: {},
      isTabRound : false,
      rippleColor : '#ccc',
      tabWidth: 0
    };
  },

  getInitialState() {
    this._tabsMeasurements = [];
    this._tabWidths = [];
    return {
      _leftTabUnderline: new Animated.Value(0),
      _widthTabUnderline: new Animated.Value(0),
      _scrollTabTop : new Animated.Value(0),
      _containerWidth: null,
    };
  },

  componentDidMount() {
    this.props.scrollValue.addListener(this.updateView);
  },

  updateView(offset) {
    const position = Math.floor(offset.value);
    const pageOffset = offset.value % 1;
    const tabCount = this.props.tabs.length;
    const lastTabPosition = tabCount - 1;
    //console.warn("offset value = "+offset.value+", position "+position+" , pageOffset = "+pageOffset);
    if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
      return;
    }

    if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
      this.updateTabPanel(position, pageOffset);
      this.updateTabUnderline(position, pageOffset, tabCount);
    }
  },

  necessarilyMeasurementsCompleted(position, isLastTab) {
    return this._tabsMeasurements[position] &&
      (isLastTab || this._tabsMeasurements[position + 1]) &&
      this._tabContainerMeasurements &&
      this._containerMeasurements;
  },

  updateTabPanel(position, pageOffset) {
    const containerWidth = this._containerMeasurements.width;
    const tabWidth = this._tabsMeasurements[position].width;
    const nextTabMeasurements = this._tabsMeasurements[position + 1];
    const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
    const tabOffset = this._tabsMeasurements[position].left;
    const absolutePageOffset = pageOffset * tabWidth;
    let newScrollX = tabOffset + absolutePageOffset;

    // center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
    newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
    newScrollX = newScrollX >= 0 ? newScrollX : 0;

    if (Platform.OS === 'android') {
      this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false, });
    } else {
      const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
      newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
      this._scrollView.scrollTo({x: newScrollX, y: 0, animated: false, });
    }
  },

  setScrollTabTop(value){
    //console.warn("setScrollTabTop = "+value);
    this.state._scrollTabTop.setValue(value);
  },

  updateTabUnderline(position, pageOffset, tabCount) {
    const lineLeft = this._tabsMeasurements[position].left;
    const lineRight = this._tabsMeasurements[position].right;
    //console.warn("updateTabUnderline = "+position+", left = "+lineLeft);
    if (position < tabCount - 1) {
      const nextTabLeft = this._tabsMeasurements[position + 1].left;
      const nextTabRight = this._tabsMeasurements[position + 1].right;

      const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
      const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

      this.state._leftTabUnderline.setValue(newLineLeft);
      this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
    } else {
      this.state._leftTabUnderline.setValue(lineLeft);
      this.state._widthTabUnderline.setValue(lineRight - lineLeft);
    }
  },

  renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler) {
    const { activeTextColor, inactiveTextColor, textStyle,isTabRound,rippleColor, tabContainerStyle,tabWidth } = this.props;
    const textColor =  inactiveTextColor;//isTabActive ? activeTextColor : inactiveTextColor;
    //const fontWeight = 'normal';//isTabActive ? 'bold' : 'normal';
    const bgColor = isTabActive ? {backgroundColor : activeTextColor}: {};
    var _width = {};
    if(tabWidth > 0){
      _width = {width:tabWidth};
    }
    //console.warn("width = "+_width.width);
    if(!isTabRound){
      return <Button
        key={`${name}_${page}`}
        accessible={true}
        accessibilityLabel={name}
        accessibilityTraits='button'
        onPress={() => onPressHandler(page)}
        onLayout={onLayoutHandler}
        rippleColor = {rippleColor}
        style={[styles.tabContainerStyle,tabContainerStyle,_width]}
      >
        <View style={[styles.tab, this.props.tabStyle ]}>
          <Text style={[textStyle,{color: textColor, }, ]}>
            {name}
          </Text>
        </View>
      </Button>;
    }
    else{
      return (
      <View 
        key={`${name}_${page}`}
        accessible={true}
        accessibilityLabel={name}
        onLayout={(event) =>{
          this.measureTab(page,event);
        }}
        style={[styles.tabContainerStyle,tabContainerStyle,_width]}>
          <Button
            onPress={() => onPressHandler(page)}
            rippleRound = {true}
            rippleColor = {rippleColor}
            style={[_width]}
          >
            <View style={[styles.tab, this.props.tabStyle, ]}>
              <Text style={[textStyle,{color: "#fff", }, ]}>
                {name}
              </Text>
            </View>
          </Button>
      </View>);
    }
    
  },

  measureTab(page, event) {
    const { x, width, height, } = event.nativeEvent.layout;
    //console.warn("measureTab page = "+page +" , x = "+x+" , width = "+width+" , h = "+height);
    this._tabsMeasurements[page] = {left: x, right: x + width, width, height, };
    this.updateView({value: this.props.scrollValue._value, });

    if(page == this.props.activeTab){
      this.state._leftTabUnderline.setValue(x);  
    }
    
  },

  render() {
    const tabUnderlineStyle = {
      position: 'absolute',
      height: 4,
      backgroundColor: 'navy',
      bottom: 0,
    };

    const dynamicTabUnderline = {
      left: this.state._leftTabUnderline,
      width:(this.props.tabWidth >0)?this.props.tabWidth : this.state._widthTabUnderline
    };

    return <Animated.View
              style={[styles.container, 
                    {backgroundColor: this.props.backgroundColor,transform: [{ translateY: this.state._scrollTabTop }] },
                    this.props.style,]}
      onLayout={this.onContainerLayout}
    >
      <ScrollView
        ref={(scrollView) => { this._scrollView = scrollView; }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        directionalLockEnabled={true}
        bounces={false}
        scrollsToTop={false}
      >
        <View
          style={[styles.tabs, {width: this.state._containerWidth, }, this.props.tabsContainerStyle, ]}
          ref={'tabContainer'}
          onLayout={this.onTabContainerLayout}
        >
          <Animated.View style={[tabUnderlineStyle, dynamicTabUnderline, this.props.underlineStyle,]} />
          {this.props.tabs.map((name, page) => {
            const isTabActive = this.props.activeTab === page;
            const renderTab = this.props.renderTab || this.renderTab;
            return renderTab(name, page, isTabActive, this.props.goToPage, this.measureTab.bind(this, page));
          })}
        </View>
      </ScrollView>
    </Animated.View>;
  },

  componentWillReceiveProps(nextProps) {
    // If the tabs change, force the width of the tabs container to be recalculated
    if (JSON.stringify(this.props.tabs) !== JSON.stringify(nextProps.tabs) && this.state._containerWidth) {
      this.setState({ _containerWidth: null, });
    }
  },

  onTabContainerLayout(e) {
    this._tabContainerMeasurements = e.nativeEvent.layout;
    let width = this._tabContainerMeasurements.width;
    if (width < WINDOW_WIDTH) {
      width = WINDOW_WIDTH;
    }
    this.setState({ _containerWidth: width, });
    this.updateView({value: this.props.scrollValue._value, });
  },

  onContainerLayout(e) {
    this._containerMeasurements = e.nativeEvent.layout;
    this.updateView({value: this.props.scrollValue._value, });
  },
});

module.exports = CustomScrollableTabBar;

const styles = StyleSheet.create({
  tab: {
    //height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingLeft: 10,
    // paddingRight: 10,
  },
  container: {
    //height: 40,
    width:"100%",
    position:"absolute",
   // top:40,
    zIndex:10
    
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:"center",
  },
  tabContainerStyle :{
    justifyContent:"center",
    alignItems:"center"
  }
});
