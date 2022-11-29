import { useEffect } from 'react';
import { useDragLayer } from 'react-dnd';
import { BoxDragPreview } from './BoxDragPreview.js';

import classes from './CustomDragLayer.module.css';

const bound = (value, upper, lower) => {
    if(upper > lower) [upper, lower] = [lower, upper]
    return value < upper ? upper :
           value > lower ? lower : value;
}

const getItemStyles = (initialOffset, currentOffset, upper, lower) => {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none',
        }
    }
    const x = initialOffset.x;
    const y = bound(currentOffset.y, upper, lower);
    const transform = `translate(${x}px, ${y}px)`
    return {
        transform,
        WebkitTransform: transform
    }
}

export const CustomDragLayer = (props) => {
    const { itemType, isDragging, item, initialOffset, currentOffset } =
        useDragLayer((monitor) => ({
            item: monitor.getItem(),
            itemType: monitor.getItemType(),
            initialOffset: monitor.getInitialSourceClientOffset(),
            currentOffset: monitor.getSourceClientOffset(),
            isDragging: monitor.isDragging(),
    }));

    const renderItem = () => {
        switch (itemType) {
        case 'option':
            return <BoxDragPreview leftProps={item.leftProps} children={item.children} />
        default:
            return null
        }
    }

    useEffect(() => {
        if(props.onDragging)
            props.onDragging(isDragging);
    }, [isDragging]);

    if (!isDragging) {
        return null;
    }

    const upper = item.containerInfo.y;
    const lower = item.containerInfo.y + item.containerInfo.height - item.height;

    return (
        <div
            className={classes.layer}
            style={{width: item.width}}
        >
        <div
            style={getItemStyles(initialOffset, currentOffset, upper, lower)}
        >
            {renderItem()}
        </div>
        </div>
    )
}
