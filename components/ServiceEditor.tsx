import { FunctionComponent, useContext, useEffect } from "react";
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
    const serviceKind = context.services[props.service.kind ?? props.service.id];

    const getServiceInstance = (form: HTMLFormElement) => {
        const service = JSON.parse(JSON.stringify(props.service)) as ServiceData;
        if (!isDeployed) service.id += "-" + randomId(8);
        service.kind = props.service.kind ?? props.service.id;
        const data = new FormData(form);
        service.name = data.get("service-name") as string || serviceKind.name;
        service.description = data.get("service-description") as string || serviceKind.description;
        Object.keys(service.attrs).forEach(id => service.attrs[id].value = data.get(id) as string ?? service.attrs[id].value);
        return service;
    };

    useEffect(() => {
        (document.getElementById("service-name") as HTMLInputElement).value = props.service.name;
        (document.getElementById("service-description") as HTMLInputElement).value = props.service.description;
    }, [props.service]);

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
                <input type="text" id="service-name" name="service-name" placeholder={serviceKind.name} />
            </div>
            <div>
                <label htmlFor="service-description">Service description: </label>
                <input type="text" id="service-description" name="service-description" placeholder={serviceKind.description} />
            </div>
            {Object.entries(props.service.attrs).map(([id, attr]) => <>
                <div key={id}>
                    <label htmlFor={id}>{attr.name}: </label>
                    {
                        Array.isArray(attr.type) ?
                            <select id={id} name={id}>
                                {attr.type.map(opt => <option key={opt} value={opt} selected={opt === props.service.attrs[id].value}>{opt}</option>)}
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
