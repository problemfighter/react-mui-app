PROJECT_NAME="react-mui-app"
if [ "$#" -e 1 ]; then
    PROJECT_NAME="$1"
fi
echo "Welcome to React Material UI Application (RMA)";
echo "-------------------------------------------------------------"
echo "-------------------------------------------------------------"

echo "Cloning Root Project From GitHub";
if [ -d "$PROJECT_NAME" ]; then
  rm -rf "$PROJECT_NAME"
fi
git clone https://github.com/problemfighter/react-mui-app.git


echo "Preparing Development Source Dependency"
cd "$PROJECT_NAME"
DS="dependency-source"
mkdir -p "$DS"
cd "$DS"


echo "Cloning Project react-mui-ui";
if [ -d "react-mui-ui" ]; then
  rm -rf react-mui-ui
fi
git clone https://github.com/hmtmcse/react-mui-ui.git


echo "Cloning Project tm-react";
if [ -d "tm-react" ]; then
  rm -rf tm-react
fi
git clone https://github.com/hmtmcse/tm-react.git

cd ..

echo "Installing yarn";
npm install -g yarn

echo "Installing Dependency";
yarn install

cd ui/rma/data
yarn install