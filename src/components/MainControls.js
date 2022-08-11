import classNames from "classnames";
import { useState } from "react";
import "./MainControls.css";

// Two or more adjacent buttons are displayed using this component.
// They have dropdown items ('children' prop), and the shared 'state'
// prop is managed so that only one can be displayed at a time.
const DropdownSection = ({ title, state: [currentState, setState], children }) => {
  const show = currentState === title;
  const toggle = () => setState(prev => {
    if (prev === title) return null; // display none
    return title; // display this
  });
  return (
    <div className="DropdownSection">
      <button onClick={toggle} className={classNames({ highlight: show })}>{title}</button>
      <div className={classNames({ hide: !show })}>{children}</div>
    </div>
  );
};

const ActivitiesList = () => {
  return (
    <div className="ActivitiesList">
      <div>Sample activity 1</div>
      <div>Sample activity 2</div>
      <div>Sample activity 3</div>
    </div>
  )
};

const MainControls = () => {
  const dropdownState = useState(null);

  const [popup, setPopupObject] = useState({ element: null, shown: false });
  const setPopup = element => setPopupObject(prev => {
    if (prev.shown) return { element: prev.element, shown: false };
    return { element, shown: true };
  });
  const hidePopup = () => setPopupObject(p => ({ element: p.element, shown: false }));

  return (
    <div className="MainControls" onClick={e => { if (e.target.classList.contains("MainControls")) hidePopup() }}>
      <div>
        <button>Begin</button>
        <button>Begin (past)</button>
        <button>Stop</button>
        <button>Stop (past)</button>
        <button>Continue</button>
      </div>
      <div>
        <button>Insert</button>
        <button>Remove</button>
        <button>Edit</button>
        <button>Edit (past)</button>
      </div>
      <div>
        <DropdownSection state={dropdownState} title="Day...">
          <button>Begin</button>
          <button>Edit</button>
          <button>Finish</button>
          <button>Continue</button>
        </DropdownSection>
        <DropdownSection state={dropdownState} title="Activities...">
          <button onClick={() => setPopup(<ActivitiesList />)}>List</button>
          <button>Edit</button>
          <button>Delete</button>
        </DropdownSection>
      </div>
      {!popup.element || <div className={classNames("popup", { shown: popup.shown })}>
        <div className="popup-container">{popup.element}</div>
        <button onClick={hidePopup} className="close-button"></button>
      </div>}
    </div>
  );
};

export default MainControls;
