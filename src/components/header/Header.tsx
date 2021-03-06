import React, { useEffect } from "react";
import { useState, ChangeEvent, useCallback } from "react";
import { Button } from "components";
import { makeStyles } from "@material-ui/core/styles";
import { useActions } from "hooks";
import { EditorState, convertToRaw } from "draft-js";
import CardsForm from "../../containers/cardsContainer/cardsForm/CardsForm";
import CardSidebar from "../../containers/cardsContainer/cardSidebar/cardSidebar";

interface CardInfo {
    title: string;
    agenda: string;
}

const useStyles = makeStyles({
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 80,
        padding: "0 20px",
        backgroundColor: "#282c34",
        fontSize: 24,
        color: "#61dafb",
    },
    paper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "70%",
        maxWidth: 1000,
        padding: 10,
    },
    input: {
        marginBottom: 20,
    },
    editor: {
        minHeight: 300,
        WebkitBoxShadow: "0px 0px 8px -1px rgba(34, 60, 80, 0.3)",
        MozBoxShadow: "0px 0px 8px -1px rgba(34, 60, 80, 0.3)",
        BoxShadow: "0px 0px 8px -1px rgba(34, 60, 80, 0.3)",
        boxSizing: "border-box",
        padding: 10
    }
    ,
    dateBlock: {
        margin: "10px 0",
        padding: "0px 10px",
        display: "flex",
        justifyContent: "space-between"
    },
    dateField: {
        width: 150
    }
});

const initCardInfo = {title: "", agenda: ""};

export default function Header() {
    const classes = useStyles();

    const [open, setOpen] = useState(false);
    const [cardInfo, setCardInfo] = useState<CardInfo>(initCardInfo);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('10:00');
    const [editorState, setEditorState] = useState(
        () =>
            EditorState.createEmpty()
    );

    const {createMeetings, getMeetings} = useActions();

    const handleChangeInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) =>
            setCardInfo((prevCardInfo) => {
                return {
                    ...prevCardInfo,
                    [event.target.name]: event.target.value,
                };
            }),
        []
    );

    useEffect(() => {
        getMeetings();
    }, [open]);

    const onSaveCard = () => {
        const newCard = {
            title: cardInfo.title,
            notes: cardInfo.agenda,
            description: JSON.stringify(convertToRaw(editorState.getCurrentContent())),
            participants: [{fullName: 'kek', lastName: 'kek', isAdmin: true, isSpeaker: true}],
            dates: [
                date,
                time,
            ]
        };
        createMeetings(newCard);

        setOpen(false);
        setCardInfo(initCardInfo);
    };

    // @ts-ignore
    return (
        <>
        <header className={classes.header}>
            <h3 className="header_title">Tech Talks App</h3>
            <Button onClick={() => setOpen(true)}> Add Card</Button>
        </header>
            <CardSidebar
                open={open}
                onClose={() => setOpen(false)}
                child={
                    <CardsForm
                        title={cardInfo.title}
                        date={date}
                        setDate={setDate}
                        time={time}
                        setTime={setTime}
                        editorState={editorState}
                        setEditorState={setEditorState}
                        editCard={onSaveCard}
                        handleChangeInput={handleChangeInput}
                    />
                }
            />
        </>
    );
}
