import styles from "./app.module.css";
import Tab from "./Tab";
import TabProvider, { Id as TabId } from "./TabProvider";
import UserConfigProvider from "./UserConfigProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MainContent from "./MainContent";
import { useMediaQuery } from "@uidotdev/usehooks";

const queryClient = new QueryClient();
const ASIDE_WIDTH = 280;

function App() {
  const isDesktopOrLaptop = useMediaQuery(
    "only screen and (min-width : 769px)"
  );
  const mainWidth = isDesktopOrLaptop ? `480px` : "100%";
  const mainTranslateX = isDesktopOrLaptop ? `${ASIDE_WIDTH / 2}px` : "0px";

  return (
    <QueryClientProvider client={queryClient}>
      <UserConfigProvider>
        <TabProvider>
          <header className={styles.header}>
            <img src="/vite.svg" alt="log" />
            <Tab tabId={TabId.FOLLOWING}>following</Tab>
            <Tab tabId={TabId.FOR_YOU}>for you</Tab>
          </header>
          <MainContent
            className={styles.main}
            style={{
              width: mainWidth,
              transform: `translateX(${mainTranslateX})`,
            }}
          />
          {isDesktopOrLaptop && (
            <aside
              className={styles.aside}
              style={{ width: `${ASIDE_WIDTH}px` }}
            >
              <ul>
                <li>1</li>
                <li>2</li>
                <li>3</li>
              </ul>
            </aside>
          )}
          <nav></nav>
        </TabProvider>
        <footer></footer>
      </UserConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
