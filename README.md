wirenock
========

Proxy Server that will also stub out responses

## Install
Git clone the repository.

	git clone https://github.com/steven2y/wirenock.git

Then run

	npm install

## Run
Run

	node lib/wirenock.js http://google.com 9090



## Recording Mode

    node lib/wirenock.js http://google.com 9090 --record --debug

    currently recordings go into /lib/routes/temp
    
    To use the mappings
    move the recordings into stubs _files and mappings then restart server