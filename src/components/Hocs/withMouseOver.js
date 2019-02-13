function withMouseOver (WrappedComponent) {
    return class HoverableComponent extends Component {
      constructor (props) {
        super(props)
  
        this.state = { mouseOver: false }
      }
  
      turnHoverOn () {
        this.setState({ mouseOver: true })
      }
  
      turnHoverOff () {
        this.setState({ mouseOver: false })
      }
  
      render () {
        const props = { mouseOver: this.state.mouseOver, ...this.props }
        return (
          <div onMouseEnter={() => this.turnHoverOn()} onMouseLeave={() => this.turnHoverOff()}>
            <WrappedComponent { ...props } />
          </div>
        )
      }
    }
  }

  export default withMouseOver;