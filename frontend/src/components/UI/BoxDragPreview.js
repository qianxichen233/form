import { memo, useEffect, useState } from "react";

import classes from './BoxDragPreview.module.css';

import OptionInputBar from "./OptionInputBar";

export const BoxDragPreview = memo(function BoxDragPreview({ leftProps, children }) {
    const [tickTock, setTickTock] = useState(false);
    useEffect(
        function subscribeToIntervalTick() {
            const interval = setInterval(() => setTickTock(!tickTock), 500);
            return () => clearInterval(interval);
        },
        [tickTock]
    );
    return (
        <div className={classes.previewBox}>
            <OptionInputBar {...leftProps} isDragging={true} opacity={'0.5'}>{children}</OptionInputBar>
        </div>
    );
});

