import Spinner from "react-bootstrap/Spinner";

const StatusLoader = () => {
    return (

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // border: 'solid 1px red',
                // height: '100vh'
                height: 'calc(100vh - 58px)'
            }}>
                <Spinner animation="border" />
            </div>

    )
}

export default StatusLoader;
