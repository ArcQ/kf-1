(defproject kf1 "0.1.0-SNAPSHOT"
  :dependencies [[org.clojure/clojure "1.9.0"]
                 [org.clojure/clojurescript "1.10.439"]
                 [binaryage/oops "0.6.3"]
                 [reagent "0.8.0"]
                 [re-frame "0.10.5"]
                 [secretary "1.2.3"]
                 [cljfmt "0.5.1"]
                 [cljs-http "0.1.45"]]

  :plugins [[lein-cljsbuild "1.1.7"]]

  :min-lein-version "2.5.3"

  :source-paths ["src/clj" "src/cljs"]

  :clean-targets ^{:protect false} ["resources/public/js/compiled" "target"]

  :figwheel {:css-dirs ["resources/public/css"]
             :ring-handler kf1.dev-server/handler}

  :profiles
  {:dev
   {:dependencies [[figwheel-sidecar "0.5.16"]
                   [com.cemerick/piggieback "0.2.1"]
                   [binaryage/devtools "0.9.10"]]
    :source-paths ["src/cljs"]
    :plugins      [[lein-figwheel "0.5.16"]]}
   :prod { }
   }
  :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl]}

  :cljsbuild
  {:builds
   [{:id           "dev"
     :source-paths ["src/cljs"]
     :figwheel     {:on-jsload "kf1.core/mount-root"
                    :websocket-host :js-client-host }
     :compiler     {:main                 kf1.core
                    :output-to            "resources/public/js/compiled/app.js"
                    :output-dir           "resources/public/js/compiled/out"
                    :asset-path           "js/compiled/out"
                    :install-deps true
                    :closure-defines {
                                      process.env/NODE_ENV "development"
                                      process.env/REACT_APP_ASSET_URL "development"
                                      }
                    :foreign-libs [{:file "resources/js/game-engine/dist/gameEngine.js"
                                    :provides ["kfGameEngine"]
                                    :module-type :commonjs}]
                    :source-map-timestamp true
                    :preloads             [devtools.preload]
                    :external-config      {:devtools/config {:features-to-install :all}}
                    }}

    {:id           "min"
     :source-paths ["src/cljs"]
     :compiler     {:main            kf1.core
                    :output-to       "resources/public/js/compiled/app.js"
                    :optimizations   :advanced
                    :closure-defines {goog.DEBUG false}
                    :pretty-print    false}}


    ]}
  )
