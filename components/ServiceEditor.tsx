import { FunctionComponent, useContext } from "react";
import Service, { ServiceData } from "./Service";
import WorkspaceContext from "./WorkspaceContext";
import { ArrowBack, Close } from "@mui/icons-material";
import styles from "./ServiceEditor.module.css";
import { randomBytes } from "crypto";

function randomId(length: number) {
    return randomBytes(Math.round(length / 2)).reduce((acc, cur) => acc + cur.toString(16).padStart(2, "0"), "").slice(0, length);
}

interface ServiceEditorProps {
    service: ServiceData
}

const ServiceEditor: FunctionComponent<ServiceEditorProps> = (props: ServiceEditorProps) => {
    const context = useContext(WorkspaceContext);

    const isDeployed = context.deployedServices[props.service.id] !== undefined;

    const getServiceInstance = (form: HTMLFormElement) => {
        const service = JSON.parse(JSON.stringify(props.service)) as ServiceData;
        if (!isDeployed) service.id += "-" + randomId(8);
        const data = new FormData(form);
        service.name = data.get("service-name") as string || service.name;
        service.description = data.get("service-description") as string || service.description;
        Object.keys(service.attrs).forEach(id => service.attrs[id].value = data.get(id) as string ?? service.attrs[id].value);
        return service;
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        context.addDeployedService(getServiceInstance(event.currentTarget ?? event.target as HTMLFormElement));
        context.setSelected(undefined);
    };

    return <>
        <h3>
            <ArrowBack className={styles["back-arrow"]} onClick={() => context.setSelected(undefined)} />
            {isDeployed ? <Close className={styles["close-button"]} onClick={() => {
                context.removeDeployedService(props.service.id);
                context.setSelected(undefined);
            }} /> : null}
            Configuration: {props.service.name}
        </h3>
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="service-name">Service name: </label>
                <input type="text" id="service-name" name="service-name" placeholder={props.service.name} />
            </div>
            <div>
                <label htmlFor="service-description">Service description: </label>
                <input type="text" id="service-description" name="service-description" placeholder={props.service.description} />
            </div>
            {Object.entries(props.service.attrs).map(([id, attr]) => <>
                <div key={id}>
                    <label htmlFor={id}>{attr.name}: </label>
                    {
                        attr.type.includes("|") ?
                            <select id={id} name={id}>
                                {attr.type.split("|").map(opt => <option key={opt} value={opt} selected={opt === props.service.attrs[id].value}>{opt}</option>)}
                            </select> :
                            <input id={id} name={id} value={attr.value} />
                    }
                </div>
            </>)}
            <input type="submit" value="Accept" />
        </form>
    </>;
};

export default ServiceEditor;
