module github.com/drbh/gmessage/server

go 1.19

require (
	github.com/getlantern/systray v1.2.2
	github.com/gofiber/fiber/v2 v2.45.0
	github.com/mattn/go-sqlite3 v1.14.16
	github.com/nomic-ai/gpt4all/gpt4all-bindings/golang v0.0.0-20230517135620-bce2b3025b36
	github.com/skratchdot/open-golang v0.0.0-20200116055534-eef842397966
	github.com/webview/webview v0.0.0-20230415172654-8387ff8945fc
)

replace github.com/nomic-ai/gpt4all/gpt4all-bindings/golang => ./vendors/gpt4all-bindings/golang

require (
	github.com/andybalholm/brotli v1.0.5 // indirect
	github.com/getlantern/context v0.0.0-20190109183933-c447772a6520 // indirect
	github.com/getlantern/errors v0.0.0-20190325191628-abdb3e3e36f7 // indirect
	github.com/getlantern/golog v0.0.0-20190830074920-4ef2e798c2d7 // indirect
	github.com/getlantern/hex v0.0.0-20190417191902-c6586a6fe0b7 // indirect
	github.com/getlantern/hidden v0.0.0-20190325191715-f02dbb02be55 // indirect
	github.com/getlantern/ops v0.0.0-20190325191751-d70cb0d6f85f // indirect
	github.com/go-stack/stack v1.8.0 // indirect
	github.com/google/uuid v1.3.0 // indirect
	github.com/klauspost/compress v1.16.3 // indirect
	github.com/mattn/go-colorable v0.1.13 // indirect
	github.com/mattn/go-isatty v0.0.18 // indirect
	github.com/mattn/go-runewidth v0.0.14 // indirect
	github.com/oxtoacart/bpool v0.0.0-20190530202638-03653db5a59c // indirect
	github.com/philhofer/fwd v1.1.2 // indirect
	github.com/rivo/uniseg v0.2.0 // indirect
	github.com/savsgio/dictpool v0.0.0-20221023140959-7bf2e61cea94 // indirect
	github.com/savsgio/gotils v0.0.0-20230208104028-c358bd845dee // indirect
	github.com/tinylib/msgp v1.1.8 // indirect
	github.com/valyala/bytebufferpool v1.0.0 // indirect
	github.com/valyala/fasthttp v1.47.0 // indirect
	github.com/valyala/tcplisten v1.0.0 // indirect
	golang.org/x/sys v0.8.0 // indirect
)
