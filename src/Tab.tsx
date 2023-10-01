import { HTMLProps, PropsWithChildren, useContext } from "react";
import { TabContext, TabDispatch, Id as TabId } from "./TabProvider";
import styles from "./tab.module.css";

const Tab = ({
  children,
  tabId,
}: HTMLProps<HTMLButtonElement> & { tabId: TabId }) => {
  const dispatch = useContext(TabDispatch);

  const handleClick = () => {
    dispatch({ type: "UPDATE_TAB", payload: { id: tabId } });
  };

  return (
    <button type="button" onClick={handleClick}>
      {children}
    </button>
  );
};

export default Tab;

export const TabContainer = ({ children }: PropsWithChildren) => {
  const tabContext = useContext(TabContext);

  return (
    <div
      className={styles.tabContainer}
      style={{
        transform: `translateX(${
          tabContext.id === TabId.FOLLOWING ? "0%" : "-50%"
        })`,
      }}
    >
      {children}
    </div>
  );
};