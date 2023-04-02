import { FunctionComponent, useState } from "react";
import Service, { ServiceData } from "./Service";
import styles from "./Workspace.module.css";
import ServiceEditor from "./ServiceEditor";
import WorkspaceContext from "./WorkspaceContext";

interface WorkspaceProps {
    services: { [id: string]: ServiceData },
    deployed?: { [id: string]: ServiceData }
}

const Workspace: FunctionComponent<WorkspaceProps> = (props: WorkspaceProps) => {
    const [deployedServices, setDeployedServices] = useState(props.deployed ?? {});
    const [selected, setSelected] = useState<ServiceData | undefined>(undefined);

    return <div className={styles.workspace}>
        <WorkspaceContext.Provider value={{
            services: props.services,
            deployedServices, setDeployedServices, selected, setSelected,
            addDeployedService: (service: ServiceData) => deployedServices[service.id] = service,
            removeDeployedService: (id) => delete deployedServices[id]
        }}>
            <div>
                <div className={styles.components} hidden={selected !== undefined}>
                    <h3>Components</h3>
                    <div className={styles.container}>
                        {
                            Object.entries(props.services)
                                .map(([id, service]) => <Service key={id} {...service} />)
                        }
                    </div>
                </div>
                <div className={styles.configuration} hidden={selected === undefined}>
                    {selected ? <ServiceEditor service={selected} /> : undefined}
                </div>
            </div>
            <div className={styles.summary}>
                <h3>Summary</h3>
                <div className={styles.container}>
                    {Object.entries(deployedServices).map(([id, service]) => <Service key={id} {...service} />)}
                </div>
            </div>
        </WorkspaceContext.Provider>
    </div>;
};

export default Workspace;
