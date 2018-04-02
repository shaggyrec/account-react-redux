import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Map, Marker, MarkerLayout } from 'yandex-map-react'
import './st/Map.css'

class YandexMap extends Component{
    renderOverlay(blocked,blockedMessage){
        if(blocked) {
            return <div className='map__overlayDisable'>
                    <h4>{blockedMessage || ''}</h4>
                </div>;
        }else{
            return <div/>
        }
    }
    render () {
        let { onActionend,onActiontick, onActiontickcomplete,onMultitouchstart,onActionbegin, center, controls, blocked, blockedMessage, width, height } = this.props
        controls = controls || ['default']
        width = width || '100%'
        height = height || 300

        if(center) {
            if(typeof(center) === 'string'){
                if(center.indexOf(' ') !== -1) {
                    center = center.split(' ')
                }else if(center.indexOf(',') !== -1) {
                    center = center.split(',')
                }
            }
            else if(typeof(center) === 'object') {
                center = [this.props.center[0],this.props.center[1]]
            }
        }else{
            center = [55.754734, 37.583314]
        }
        return (
            <Map onAPIAvailable={function () {

            }}
                 center={center}
                 zoom={16}
                 width={width}
                 height={height}
                 onActionend={onActionend}
                 onActiontick={onActiontick}
                 onActiontickcomplete={onActiontickcomplete}
                 onActionbegin={onActionbegin}
                 onMultitouchstart={onMultitouchstart}
                 state={{controls: controls, behaviors: ['drag', 'multiTouch']}}>
                {this.renderOverlay(blocked,blockedMessage)}
                <div className='map__placemark'/>
            </Map>
        )
    }
}

export  default  YandexMap