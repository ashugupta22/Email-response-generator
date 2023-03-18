import { Configuration, OpenAIApi } from 'openai';
import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { FormControl, InputLabel, Select, MenuItem, Modal, Box, } from '@mui/material';
import "./responseGenerator.css";
import GenerateTypes from './GenerateTypes';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px',
    borderRadius: "6px",
    boxShadow: 4,
    p: 4,
};

function ResponseGenerator() {

        // -------------------Modal functions-----------------
        const [open, setOpen] = useState(false);
        const handleOpen = () => setOpen(true);
        const handleClose = () => setOpen(false);

    // -------------------------OpenAi configurations--------------------------------
    const configuration = new Configuration({
        apiKey: "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"
    });

    const openai = new OpenAIApi(configuration);

    // -----------------------Get textarea value-----------------------
    const [textareaValue, setTextareaValue] = useState("");

    const handleTextarea = (e) => {
        const getTextareaValue = e.target.value;
        setTextareaValue(getTextareaValue);
    };



    // -----------------------Get dropdown selected value and fetch Generated Response-----------------
    const [selectedValue, setSelectedValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedResponse, setGeneratedResponse] = useState("");

    const responseGenerate = async (e) => {

        const getSelectedValue = e.target.value;
        setSelectedValue(getSelectedValue);

        if (textareaValue.length > 0) {
            setGeneratedResponse("");
            try {
                if (getSelectedValue !== "Custom Reply") {
                    setLoading(true);
                    const response = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: getSelectedValue + textareaValue,
                        temperature: 0.5,
                        max_tokens: 240,
                        top_p: 1,
                        frequency_penalty: 0,
                        presence_penalty: 0,
                        stop: ["\n"],
                    });
                    setGeneratedResponse(response.data.choices[0].text);
                    setLoading(false);
                }

            }
            catch (err) {
                console.log(err);
            }
        }
        else {
            alert("Please enter email text")
        }

    };

    // ---------------------for default value and custom input fetch response --------------------
    const [custonTextValue, setCustomTextValue] = useState("");
    console.log(custonTextValue);
    const handleCustomText = (e) =>{
        const getCustomTextValue = e.target.value;
        setCustomTextValue(getCustomTextValue);
    }

    const generate = async () =>{

        setGeneratedResponse("");
        try {
                setLoading(true);
                const response = await openai.createCompletion({
                    model: "text-davinci-003",
                    prompt: custonTextValue.length > 0 ? (custonTextValue) : ("write detail reply to the email: ") + textareaValue,
                    temperature: 0.5,
                    max_tokens: 240,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    stop: ["\n"],
                });
                setGeneratedResponse(response.data.choices[0].text);
                setLoading(false);
            }

        catch (err) {
            console.log(err);
        }


    }


    return (
        <>
            <main >
                <Card className="container" >
                    <div>
                        <textarea placeholder='Email Text' className="text-box" onChange={handleTextarea}></textarea>
                    </div>
                    {
                        generatedResponse.length > 1 ? (<div className='display-response'>{generatedResponse}</div>) : loading === true ? ("Loading...") : ""
                    }
                    <CardContent>
                        <button className='btn-generate me-3' onClick={generate}>Generate Reply</button>
                        <FormControl sx={{ width: "200px" }} size="small"  >
                            <InputLabel id="demo-simple-select-label">Select Reply</InputLabel>
                            <Select
                            
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedValue}
                                label="Select Reply"
                                onChange={responseGenerate}
                            >
                                {
                                    GenerateTypes.map((getTypes, key) => (
                                        <MenuItem key={key} value={getTypes.VALUE}>{getTypes.NAME}</MenuItem>
                                    ))
                                }
                                <MenuItem onClick={handleOpen} value={"Custom Reply"}>Custom Reply</MenuItem>
                            </Select>
                        </FormControl>
                    </CardContent>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <h4 className='modal-custom'>Enter short custom reply to generate: </h4>
                            <textarea className='modal-text-area' onChange={handleCustomText}></textarea>
                            <button className='btn-generate' onClick={() =>{generate(); handleClose();}}>Generate</button>
                        </Box>
                    </Modal>
                </Card>
            </main>
        </>
    );
};
export default ResponseGenerator;