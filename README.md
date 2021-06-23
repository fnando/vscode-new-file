# New File for VSCode

Create new files from your keyboard.

## Usage

There's only one shortcut: `cmd+alt+n`/`ctrl+alt+n`.

By default, it uses the current workspace folder as the root path. You can
override it by typing `~` to render the home dir, or `/` to render the root dir.

To create directories, just add a `/` to the end of the path.

If a file already exists on that given path, `new-file` will open the file
instead.

![new-file in action](https://github.com/fnando/vscode-new-file/raw/main/new-file.gif)

File and folder names can have any of the following directives:

- `%Y` - 4-digit year
- `%m` - 2-digit month (e.g. 04 or 12)
- `%d` - 2-digit date (e.g. 07 or 26)
- `%H` - 2-digit hour (e.g. 03 or 22)
- `%M` - 2-digit minute (e.g. 06 or 45)
- `%S` - 2-digit second (e.g. 08 or 56)
- `%F` - sames as "%Y-%m-%d"
- `%s` - Number of seconds since 1970-01-01 00:00:00 UTC.
- `%user` - Current user as per `process.env.USER`.

## License

Copyright (c) 2021 Nando Vieira

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
