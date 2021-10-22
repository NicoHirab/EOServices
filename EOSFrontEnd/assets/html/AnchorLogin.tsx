export const template = ()=> `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Anchor Link - Login</title>
    <script src="https://unpkg.com/anchor-link@3"></script>
    <script src="https://unpkg.com/anchor-link-browser-transport@3"></script>
    <script>
        // app identifier, should be set to the eosio contract account if applicable
        const identifier = 'example'
        // initialize the browser transport
        const transport = new AnchorLinkBrowserTransport()
        // initialize the link
        const link = new AnchorLink({
            transport,
            chains: [{
                chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
                nodeUrl: 'https://eos.greymass.com',
            }]
        })
        // the session instance, either restored using link.restoreSession() or created with link.login()
        let session

        // tries to restore session, called when document is loaded
        function restoreSession() {
            link.restoreSession(identifier).then((result) => {
                session = result
                if (session) {
                    didLogin()
                }
            })
        }

        // login and store session if sucessful
        function login() {
            link.login(identifier).then((result) => {
                session = result.session
                didLogin()
            })
        }

        // logout and remove session from storage
        function logout() {
            document.body.classList.remove('logged-in')
            session.remove()
        }

        // called when session was restored or created
        function didLogin() {
            document.getElementById('account-name').textContent = session.auth.actor
            document.body.classList.add('logged-in')
        }

        // transfer tokens using a session
        function transfer() {
            const action = {
                account: 'eosio.token',
                name: 'transfer',
                authorization: [session.auth],
                data: {
                    from: session.auth.actor,
                    to: 'teamgreymass',
                    quantity: '0.0001 EOS',
                    memo: 'Anchor is the best! Thank you <3'
                }
            }
            session.transact({action}).then((result) => {
            })
        }

        // ¯\_(ツ)_/¯
        window.addEventListener('keypress', (event) => {
            if (session && (event.key === 'F' || event.key === 'f')) {
                transfer()
            }
        })
    </script>
    <style>
        .logged-in #login-ui {
            display: none;
        }
        #app-ui {
            display: none;
        }
        .logged-in #app-ui {
            display: block;
        }
    </style>
</head>
<body onload="restoreSession()">
    <div id="app-ui">
        <p>Welcome <b id="account-name">foo</b>!</p>
        <ul>
            <li><button onclick="transfer()">Send an homage to team Greymass</button></li>
            <li><button onclick="logout()">Log out</button></li>
        </ul>
        <p><small>Press F to pay respects</small></p>
        <pre id="log"></pre>
    </div>
    <div id="login-ui" >
        <script type="text/javascript">
            login();
        </script>
    </div>
</body>
</html>`
{/* <button onclick="login()">Login</button> */}