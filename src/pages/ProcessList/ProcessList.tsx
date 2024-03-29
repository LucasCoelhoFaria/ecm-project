import { Body } from "../../components/Body";
import api from "../../api.json";
import { useCallback, useState } from "react";
import { ProcessGrid } from "../../components/ProcessGrid";

export const ProcessList = (): JSX.Element => {
    const [data, setData] = useState<any>();

    const getAllProcess = useCallback(async (setLoading: Function, setError: Function) => {
        try {
            const options = {
                method: 'GET'
            };
            const response = await fetch(api.Process.getAll, options);
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error: any) {
            setError(error);
            setLoading(false);
        }
    }, [data])

    const deleteProcess = useCallback(async (setLoading: Function, setError: Function, id: string) => {
        setLoading(true);
        try {
            const options = {
                method: 'DELETE'
            };
            const params = new URLSearchParams();
            params.set("processId", id);
            const response = await fetch(api.Process.delete + "?" +params, options);
            if(response.status === 200){
                console.log(data);
                const newData = data.filter(elem =>  elem.id !== id)
                setData(newData);
            }
            setLoading(false);
        } catch (error: any) {
            setError(error);
            setLoading(false);
        }
    }, [data])
    
    return (
        <Body pageTitle="Processos">
            <div>
                <ProcessGrid></ProcessGrid>
            </div>
        </Body>
    );

}

