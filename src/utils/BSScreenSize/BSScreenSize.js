// Display Bootstrap breakpoints and current screen width
import {useEffect, useState} from "react";


function BSScreenSize() {
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        function handleKeyPress(event) {
            if (event.key === '/') {
                console.log('/ pressed');
                setHidden(!hidden)
            }
        }
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress)
        }
    })

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        function handleResize() {
            setScreenWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    });

    const container = {
        zIndex: '9998',
        font: 'small-caps 900 14px sans-serif',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        height: '1.5rem',
        width: '100%',
        position: 'fixed',
        canHide: () => hidden ? "d-none" : "",
    }

    const panelOverlay = {
        height: 'inherit',
        width: '100%',
        font: 'inherit',
        dialMover: {
            width: `${screenWidth / 20}%`,
            height: 'inherit',
            font: 'inherit',
        },
        dialPointer: {
            width: '1px',
            height: 'inherit',
            font: 'inherit',
            backgroundColor: 'red',
        },
        dialValue: {
            height: 'auto',
            fontSize: '10px',
            color: 'red',
            backgroundColor: 'rgba(0,0,0,0.9)',
        },
    }

    const panel = {
        display: 'flex',
        height: 'inherit',
        width: '100%',
        font: 'inherit',
        textAlign: 'center',
        alignItems: 'center',
        xs: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: screenWidth <= 576 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            width: `${576 / 20}%`,
            height: 'inherit',
            font: 'inherit',
            borderRight: 'solid 1px black',
        },
        sm: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: screenWidth <= 768 && screenWidth > 576 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            width: `${192 / 20}%`,
            height: 'inherit',
            font: 'inherit',
            borderRight: 'solid 1px black',
        },
        md: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: screenWidth <= 992 && screenWidth > 768 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            width: `${224 / 20}%`,
            height: 'inherit',
            font: 'inherit',
            borderRight: 'solid 1px black',
        },
        lg: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: screenWidth <= 1200 && screenWidth > 992 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            width: `${208 / 20}%`,
            height: 'inherit',
            font: 'inherit',
            borderRight: 'solid 1px black',
        },
        xl: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: screenWidth <= 1400 && screenWidth > 1200 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            width: `${200 / 20}%`,
            height: 'inherit',
            font: 'inherit',
            borderRight: 'solid 1px black',
        },
        xxl: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: screenWidth <= 2000 && screenWidth > 1400 ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
            width: `${600 / 20}%`,
            height: 'inherit',
            font: 'inherit',
        }

    }

    return (
        <>
            <div id="BSScreenSize" className={container.canHide()} style={container}>
                <div id="panelOverlay" className="position-absolute z-1" style={panelOverlay}>
                    <div id="dialMover" className="d-inline-block" style={panelOverlay.dialMover}></div>
                    <div id="dialPointer" className="d-inline-block" style={panelOverlay.dialPointer}></div>
                    <div id="dialValue" className="d-inline-block position-absolute top-100 translate-middle-x" style={panelOverlay.dialValue}>{screenWidth}</div>
                </div>
                <div id="panel" className="position-absolute z-0" style={panel}>
                    <div id="xs" style={panel.xs}>xs</div>
                    <div id="sm" style={panel.sm}>sm</div>
                    <div id="md" style={panel.md}>md</div>
                    <div id="lg" style={panel.lg}>lg</div>
                    <div id="xl" style={panel.xl}>xl</div>
                    <div id="xxl" style={panel.xxl}>xxl</div>
                </div>
            </div>
        </>
    )
}

export default BSScreenSize;
