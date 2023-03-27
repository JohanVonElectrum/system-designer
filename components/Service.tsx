import { FunctionComponent, useContext } from "react";
import styles from "./Service.module.css";
import WorkspaceContext from "./WorkspaceContext";

export interface ServiceData {
    id: string,
    name: string,
    description: string,
    attrs: { [id: string]: { name: string, type: string, value?: string } }
}

type ServiceProps = ServiceData;

const Service: FunctionComponent<ServiceProps> = (props: ServiceProps) => {
    const context = useContext(WorkspaceContext);

    const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        context.setSelected(context.deployedServices[event.currentTarget.dataset.id ?? ""] ?? context.services[event.currentTarget.dataset.id ?? ""]);
    };

    return <div className={styles.service} onClick={onClick} data-id={props.id}>
        <h4>{props.attrs["service-name"]?.value ?? props.name} <code>{props.id}</code></h4>
        <h6>{props.attrs["service-description"]?.value ?? props.description}</h6>
        <ul>
            {
                Object.entries(props.attrs)
                    .filter(([id, attr]) => !id.startsWith("service") && attr.value !== undefined)
                    .map(([id, attr]) => <li key={`${props.id}-${id}`}>{attr.name}: <code>{attr.value}</code></li>)
            }
        </ul>
    </div>;
};

export default Service;
