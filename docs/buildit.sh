#! /bin/bash

rm -rf ./zenko_build
tox -e docs
# rm -rf ./docsource/_build/html/_sources
cp -r ./docsource/_build/html ./zenko_build
tox -e zenko-operations
cp ./docsource/Operation-Architecture/_build/latex/ZenkoOperation.pdf ./zenko_build
tox -e zenko-setup 
cp ./docsource/Installation/_build/latex/ZenkoInstallation.pdf ./zenko_build
tox -e zenko-reference 
cp ./docsource/Reference/_build/latex/ZenkoReference.pdf ./zenko_build
