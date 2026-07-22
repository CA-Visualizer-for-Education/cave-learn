const styles = new Proxy({}, { get: (_, key) => String(key) })

export default styles
