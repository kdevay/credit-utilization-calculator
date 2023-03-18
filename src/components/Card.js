import React, {useState, useEffect} from "react";




export default function Card(props) {
    const { card, index, update} = props;
    const charMax = 8;
    const [cardObj, setCardObj] = useState(card);
    const [displayValues, setDisplayValues] = useState({
        balance: styleValue(cardObj.balance),
        limit: styleValue(cardObj.limit)
    });
    const overlay = document.getElementById('overlay' + index);
    const popover = document.getElementById('pop' + index);
    const [overlayIsOpen, setOverlayIsOpen] = useState(false);

    const handleInput = e => {
        let {name, value} = e.target;

        // Remove any display styling
        const hasOnlyNumbers = /^\d+$/.test(value);
        value = hasOnlyNumbers ? value : unstyleValue(value);

        // Update child if input has changed
        setCardObj(() => {
            if (cardObj[name] !== value) {
                return {...cardObj, [name]: value};
            }
            return cardObj;
        });
    
        // Update cards array in parent
        value = !value ? 0 : value;
        update({...cardObj, [name]: value}, index);
    };

    useEffect(() => {
        // Style input values on change
        let bal = styleValue(cardObj.balance)
        let lim = styleValue(cardObj.limit)
        
        setDisplayValues({balance: bal, limit: lim});
    }, [cardObj]);


    const toggleOverlay = (e) => { 
        let isVisible = e.target.hasAttribute('open');
        setOverlayIsOpen(isVisible);
        if (isVisible) overlay.style.position = 'absolute';
    };

    const closePopover = (e) => {
        e.preventDefault();
        if (popover.hasAttribute('open')){
                overlay.style.position = 'relative'
                popover.removeAttribute('open');
            }
    }

    return (
        <div className='card'>
            <div 
                id={'overlay' + index} 
                className={overlayIsOpen ? 'popOverlay' : 'hide'} 
                onClick={closePopover}>
            </div>
            <div className='inputLabels'>
                <label htmlFor={'balance' + index}>
                    {'Card ' + (index + 1) + ' balance'}
                </label>
                <div className='helpDiv'>
                    <label htmlFor={'limit' + index}>
                        {'Card ' + (index + 1) + ' limit'}
                    </label>
                    <details id={'pop' + index} onToggle={toggleOverlay}>
                        <summary>?</summary>
                        <div className='popover'>
                            <h5 className='popoverHeading'>Card Balance / Limit</h5>
                            <p className='popoverBody'>Your card's balance and limit can be found on your credit card statement.</p>
                            <button onClick={closePopover} className='close'>Close</button>
                        </div>
                    </details>
                </div>
            </div>
            <div className='inputRow'>
                <input 
                    maxLength={charMax}
                    // pattern="[0-9]+"
                    name='balance'
                    id={'balance' + index}
                    onChange={handleInput}
                    value={displayValues.balance}>
                </input>
                <input 
                    maxLength={charMax}
                    // pattern="[0-9]+"
                    name='limit'
                    id={'limit' + index}
                    onChange={handleInput}
                    value={displayValues.limit}>
                </input>
            </div>
        </div>
    );
}


const styleValue = (value) => {
    // If 0 or falsy, return empty string
    if (!value) return '';

    // Remove styling
    value = unstyleValue(value);

    // Style with commas and '$'
    value = '$' + (value.toLocaleString("en-US"));
    return value;
};

const unstyleValue = (value) => {
    // If value is styled
    if (typeof value === 'string'){
        // Remove all non-numbers and cast as int
        value = parseInt(value.replace(/[^0-9]/g, ""))
    }
    return value;
}
