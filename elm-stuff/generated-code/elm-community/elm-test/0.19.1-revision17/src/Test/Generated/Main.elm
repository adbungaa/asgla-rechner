module Test.Generated.Main exposing (main)

import Tests

import Test.Reporter.Reporter exposing (Report(..))
import Console.Text exposing (UseColor(..))
import Test.Runner.Node
import Test

main : Test.Runner.Node.TestProgram
main =
    Test.Runner.Node.run
        { runs = 100
        , report = ConsoleReport Monochrome
        , seed = 129130088429981
        , processes = 8
        , globs =
            []
        , paths =
            [ "/Users/adeliabungaarvinta/Documents/UNI HALLE/ELM/ASGLA VER 1/asgla-rechner/tests/Tests.elm"
            ]
        }
        [ ( "Tests"
          , [ Test.Runner.Node.check Tests.suite
            ]
          )
        ]