#!/usr/bin/env node
const express = require('express');
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/schedule_maker'))
app.get('/*', (req: any, res: any) => {
   console.log('/*', path.join(__dirname))
   res.sendFile(path.join(__dirname));
})
app.listen(process.env['PORT'] || 4567, () => console.log('Running on port:', process.env['PORT'] || 4444))
