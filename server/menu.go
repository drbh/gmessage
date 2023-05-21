package main

import (
	"bytes"
	"fmt"
	"log"
	"os"
	"os/exec"

	"github.com/getlantern/systray"
	"github.com/skratchdot/open-golang/open"
)

func OnExit() {
	fmt.Println("Exited")
}

func OnReady() {
	serverHost := "localhost"

	systray.SetTemplateIcon(Icon, Icon)

	mOpenUI := systray.AddMenuItem("Open In Browser", "Open the application interface")
	mOpenApp := systray.AddMenuItem("Open Desktop App", "Open the application interface")

	systray.AddSeparator()

	networkInfo := systray.AddMenuItem("✔ http://"+serverHost+":"+PORT, "✔ http://"+serverHost+":"+PORT)
	memoryInfo := systray.AddMenuItem("✔ 4.5GB model loaded into memory", "✔ 4.5GB model loaded into memory")

	networkInfo.Disable()
	memoryInfo.Disable()

	systray.AddSeparator()
	mQuit := systray.AddMenuItem("Quit", "Quit the whole app")

	go func() {
		for {
			select {
			case <-mOpenApp.ClickedCh:

				exePath, err := os.Executable()
				if err != nil {
					log.Fatal(err)
				}

				cmd := exec.Command(exePath, "standalone")

				var out bytes.Buffer
				cmd.Stdout = &out

				err = cmd.Run()

				if err != nil {
					fmt.Printf("translated phrase: %q\n", out.String())
					log.Fatal(err)
				}

			case <-mOpenUI.ClickedCh:
				open.Run("http://" + serverHost + ":" + PORT)
			case <-mQuit.ClickedCh:
				systray.Quit()
				fmt.Println("Quit now...")
				return
			}
		}
	}()
}
