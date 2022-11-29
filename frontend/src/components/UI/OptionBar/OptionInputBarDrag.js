import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from "react-dnd-html5-backend";

import OptionDragBar from './OptionDragBar';
import OptionInputBar from './OptionInputBar';

import classes from './OptionInputBarDrag.module.css';

const OptionInputBarDrag = (
    { id,
      text,
      index,
      moveCard,
      children,
      Draggable,
      preview,
      otherDragging,
      getContainerInfo,
      ...leftProps }
    ) => {
    const ref = useRef(null);
    const divRef = useRef();
    const [{ handlerId }, drop] = useDrop({
        accept: 'option',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item, monitor) {
            if (!ref.current)
                return;
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex)
                return;
                
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY)
                return;
                
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY)
                return;
                
            moveCard(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    })

    const [{ isDragging }, drag, dragPreview] = useDrag({
            type: 'option',
            item: () => {
                return {
                    id,
                    index,
                    leftProps,
                    children,
                    containerInfo: getContainerInfo(),
                    width: divRef.current.offsetWidth,
                    height: divRef.current.offsetHeight,
                }
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
    });
    drag(drop(ref));

    dragPreview(getEmptyImage(), { captureDraggingState: true });

    return <div
        className={classes.dragBar}
        style={{opacity: isDragging ? 0 : 1}}
        data-handler-id={handlerId}
        ref={divRef}
    >
        {Draggable ? <OptionDragBar ref={ref} preview={preview} isDragging={otherDragging}/> : null}
        <OptionInputBar id={id} {...leftProps}>{children}</OptionInputBar>
    </div>
}

export default OptionInputBarDrag;