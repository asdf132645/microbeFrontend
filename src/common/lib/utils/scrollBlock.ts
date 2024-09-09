const disableScroll = () => {
    document.body.style.overflow = 'hidden';
}

const enableScroll = () => {
    document.body.style.overflow = 'auto';
}

export { disableScroll, enableScroll };