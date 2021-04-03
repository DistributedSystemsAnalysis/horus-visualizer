function toShivizLogEvents(logObject) {
    var vectorTimestamps = {};
    var dependencies = {};
    var logEvents = [];
    var fieldsGenerators = initFieldsGenerators();

    for (const i in logObject) {
        const logEntry = logObject[i];
        let vectorTimestamp = new VectorTimestamp(logEntry.vectorLogicalTime, logEntry.threadId);

        // VectorTimestamp is immutable, so we have to assign the updated vector timestamp
        const fields = fieldsGenerators[logEntry.type](logEntry);
        const logEvent = new LogEvent(logEntry.type, vectorTimestamp, i, fields);
        logEvent.pid = logEntry.pid;

        logEvents.push(logEvent);
    }

    return { "logEvents": logEvents, "graph": new ModelGraph(logEvents) };
}

function initFieldsGenerators() {
    var fieldsGenerators = {};
    fieldsGenerators["START"] = startFieldsGenerator;
    fieldsGenerators["END"] = endFieldsGenerator;
    fieldsGenerators["CREATE"] = createFieldsGenerator;
    fieldsGenerators["JOIN"] = joinFieldsGenerator;
    fieldsGenerators["CONNECT"] = socketFieldsGenerator;
    fieldsGenerators["ACCEPT"] = socketFieldsGenerator;
    fieldsGenerators["CLOSE"] = socketFieldsGenerator;
    fieldsGenerators["SHUTDOWN"] = socketFieldsGenerator;
    fieldsGenerators["SND"] = streamFieldsGenerator;
    fieldsGenerators["RCV"] = streamFieldsGenerator;
    fieldsGenerators["HANDLERBEGIN"] = handlerFieldsGenerator;
    fieldsGenerators["HANDLEREND"] = handlerFieldsGenerator;
    fieldsGenerators["R"] = variableRelatedFieldsGenerator;
    fieldsGenerators["W"] = variableRelatedFieldsGenerator;
    fieldsGenerators["LOCK"] = variableRelatedFieldsGenerator;
    fieldsGenerators["UNLOCK"] = variableRelatedFieldsGenerator;
    fieldsGenerators["WAIT"] = variableRelatedFieldsGenerator;
    fieldsGenerators["NOTIFY"] = variableRelatedFieldsGenerator;
    fieldsGenerators["NOTIFYALL"] = variableRelatedFieldsGenerator;
    fieldsGenerators["LOG"] = logFieldsGenerator;
    fieldsGenerators["FSYNC"] = fsyncFieldsGenerator;

    return fieldsGenerators;
}

// START
function startFieldsGenerator(startEntry) {
    var fields = {};
    fields["userTime"] = startEntry.userTime;
    fields["kernelTime"] = startEntry.kernelTime;

    return startEntry;
}

// END
function endFieldsGenerator(endEntry) {
    var fields = {};
    fields["userTime"] = endEntry.userTime;
    fields["kernelTime"] = endEntry.kernelTime;

    return endEntry;
}

// CREATE
function createFieldsGenerator(createEntry) {
    var fields = {};
    fields["userTime"] = createEntry.userTime;
    fields["kernelTime"] = createEntry.kernelTime;
    fields["childPid"] = createEntry.childPid;

    return createEntry;
}

// JOIN
function joinFieldsGenerator(joinEntry) {
    var fields = {};
    fields["userTime"] = joinEntry.userTime;
    fields["kernelTime"] = joinEntry.kernelTime;
    fields["childPid"] = joinEntry.childPid;

    return joinEntry;
}

// CONNECT / ACCEPT / CLOSE / SHUTDOWN
function socketFieldsGenerator(socketEntry) {
    var fields = {};
    fields["userTime"] = socketEntry.userTime;
    fields["kernelTime"] = socketEntry.kernelTime;
    fields["socketId"] = socketEntry.socketId;
    fields["socketFamily"] = socketEntry.socketFamily;

    return socketEntry;
}

// SND (send) / RCV (receive)
function streamFieldsGenerator(streamEntry) {
    var fields = {};
    fields["userTime"] = streamEntry.userTime;
    fields["kernelTime"] = streamEntry.kernelTime;
    fields["socketId"] = streamEntry.socketId;
    fields["socketFrom"] = streamEntry.socketFrom;
    fields["socketFromPort"] = streamEntry.socketFromPort;
    fields["socketTo"] = streamEntry.socketTo;
    fields["socketToPort"] = streamEntry.socketToPort;
    fields["socketFamily"] = streamEntry.socketFamily;

    return streamEntry;
}

// HANDLERBEGIN / HANDLEREND
function handlerFieldsGenerator(logEntry) {
    var fields = {};
    fields["userTime"] = logEntry.userTime;
    fields["kernelTime"] = logEntry.kernelTime;

    return fields;
}

// R (read) / W (write) / LOCK / UNLOCK / WAIT / NOTIFY / NOTIFYALL
function variableRelatedFieldsGenerator(logEntry) {
    var fields = {};
    fields["userTime"] = logEntry.userTime;
    fields["kernelTime"] = logEntry.kernelTime;
    fields["variable"] = logEntry.variable;
    fields["loc"] = logEntry.loc;

    return fields;
}

// LOG
function logFieldsGenerator(logEntry) {
    var fields = {};
    fields["userTime"] = logEntry.userTime;
    fields["kernelTime"] = logEntry.kernelTime;
    fields["message"] = logEntry.data.message;

    return logEntry;
}

// FSYNC
function fsyncFieldsGenerator(fsyncEntry) {
    var fields = {};
    fields["userTime"] = fsyncEntry.userTime;
    fields["kernelTime"] = fsyncEntry.kernelTime;

    return fields;
}

/*

function mapThreadsToPids(logObject) {
  var threadsToPid = {}

  for (const i in logObject) {
    const logEntry = logObject[i];

    threadsToPid[logEntry.thread] = logEntry.pid;
  }

  return threadsToPid;
}*/
