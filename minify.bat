@echo off

echo. Minifying JavaScript...

call yui-compressor.bat jquery-sticktotop.js > jquery-sticktotop.min.js
	 
echo "done."