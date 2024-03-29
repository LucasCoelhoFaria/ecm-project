import { Box } from "@mui/system"
import { SideListItem } from "./SideListItem"
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress, IconButton } from "@mui/material";
import { FieldListItem } from "./FieldListItem";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import api from "../api.json";
import Notification from "./Notification";

type DataType = {
    id: Number;
}
type FieldType =
    {
        id: Number | null,
        dataType: {
            id: Number | null,
            name: String | null
        },
        name: String,
        type: String,
        expanded: boolean
    }

export const FieldList = (props: DataType) => {
    const [items, setItems] = useState<any>([]);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useLayoutEffect(() => {
        updateList();
    }, [])

    useEffect(()=> {
        if (data && !data.error) {
            const model = data.map(element => { return {...element, expanded: false}});
            setItems([...items, ...model]);
        }
    }, [data])

    const updateList = useCallback(async () => {
        console.log("clickado")
        try {
            const options = {
                method: 'GET'
            };

            const params = new URLSearchParams();
            params.set("dataTypeId", props.id.toString());

            const response = await fetch(api.FieldType.getAll + "?" + params, options);
            const data = await response.json();
            setData(data);
            setLoading(false);
        } catch (error: any) {
            setError(error);
            Notification.error("falha ao carregar os campos. Tente novamente mais tarde!");
            setLoading(false);
        }
    },[items])

    const showItens = useCallback(() => {
        return items.map(element => {
            console.log("item", element);
            console.log("items", items);
            function setNameCallback(name: any){
                debugger;
                element.name = name;
            }
            function setTypeCallback(type: any){
                debugger;
                element.type = type;
            }
            return (<FieldListItem id={element.id} dataTypeId={element.dataType.id} expanded={element.expanded} name={element.expanded ? "" : element.name} tipo={element.type} deleteFieldTypeCallback={deleteFieldType} setNameCallback={setNameCallback} setTypeCallback={setTypeCallback}/>)
        });
    },[items])

    const createFieldType = useCallback(() => {
        console.log("item", items);
        const fieldType = {
            id: null,
            dataType: {
                id: props.id,
                name: null
            },
            name: "",
            type: "",
            expanded: true
        } as FieldType;
        setItems([...items, fieldType]);
        console.log("item2", items);
    }, [items]);

    //resolver error aqui
    const deleteFieldType = useCallback(async (id: any) => {
        debugger
        setLoading(true);
        try {
            const options = {
                method: 'DELETE'
            };
            const response = await fetch(api.FieldType.delete + id, options);
            console.log(data);
            const newData = items.filter(elem =>  elem.id !== id)
            setItems(newData);
            setLoading(false);
            window.location.reload();
        } catch (error: any) {
            setError(error);
            setLoading(false);
        }
    }, [data, items])

    return (
        <div>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', width: '99%' }}>
                <IconButton
                    size="large"
                    edge="end"
                    color="primary"
                    aria-label="profile"
                    onClick={createFieldType}
                >
                    <AddIcon />
                </IconButton>
            </Box>
            <Box sx={{ border: 'solid 1px black', padding: '10px', maxHeight: '390px', overflowY: 'scroll' }}>
                {loading ? <CircularProgress color="secondary" /> : error ? null : showItens()}
            </Box>
        </div>
    );
} 