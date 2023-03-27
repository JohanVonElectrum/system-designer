import { createContext } from "react";
import { ServiceData } from "./Service";

interface WorkspaceContextType {
    services: {[id: string]: ServiceData};

    deployedServices: {[id: string]: ServiceData};
    setDeployedServices: (services: {[id: string]: ServiceData}) => void;
    addDeployedService: (service: ServiceData) => void;
    removeDeployedService: (id: string) => boolean;

    selected?: ServiceData;
    setSelected: (service?: ServiceData) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType>({
    services: {},
    deployedServices: {},
    setDeployedServices: (services) => { },
    addDeployedService: (service) => { },
    removeDeployedService: (id) => false,
    selected: {id: "", attrs: {}, description: "", name: ""},
    setSelected: () => {}
});

export default WorkspaceContext;
