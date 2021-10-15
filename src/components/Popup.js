import React from "react";
import { Link } from 'react-router-dom';

function Popup(props) {
    return props.trigger ? (
        <div className="popup">
            <div className="popupInner">
                <p className='winner'>You {props.outcome}!</p>

                <Link to="/">
                    <button
                        className="closeBtn"
                    > Take me back
                    </button>
                </Link>
            </div>
        </div>
    ) : null;
}

export default Popup;