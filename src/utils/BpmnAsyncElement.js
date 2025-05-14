import editor from '@/store/editor';
export function isAsyncBefore(bo) {
    const prefix = editor().getProcessEngine;
    return !!(bo.get(`${prefix}:asyncBefore`) || bo.get(`${prefix}:async`));
}
export function isAsyncAfter(bo) {
    const prefix = editor().getProcessEngine;
    return !!bo.get(`${prefix}:asyncAfter`);
}
export function isAsync(bo) {
    return isAsyncAfter(bo) || isAsyncBefore(bo);
}
