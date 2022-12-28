export const RichTextToPlain = (ctx) => {
    if(!ctx) return;
    return ctx.blocks.map(
        block => (!block.text.trim() && '\n') || block.text
    ).join('\n');
}