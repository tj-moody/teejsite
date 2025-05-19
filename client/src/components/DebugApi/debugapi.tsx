import styles from "./debugapi.module.css";

type ApiSelectorProps = {
    apiSource: string;
    setApiSource: (value: string) => void;
    displayApiSource: string;
};

const DebugApi = ({
    apiSource,
    setApiSource,
    displayApiSource,
}: ApiSelectorProps) => (
    <center className={styles.debug_api}>
        <select
            value={apiSource}
            onChange={(e) => setApiSource(e.target.value)}
            className={`widget ${styles.button}`}
        >
            <option value="cloud">Cloud</option>
            <option value="local">Local</option>
        </select>
        <a className="widget">Text from: {displayApiSource}</a>
    </center>
);

export default DebugApi;
