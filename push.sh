node --version
npm --version
npm install
git clone --depth=1 https://simonmeusel:$(echo $GH_TOKEN)@github.com/simonmeusel/raacma.git
git push
npm run build
[ -d dir ] && rm -r raacma/docs
cp -r dist/* raacma/docs
cd raacma/docs
git config user.email simon.meusel.pc@t-online.de
git config user.name Simon Meusel
git add -A
if git log -1 --oneline | grep -q 'Automatic build'; then
  git commit --amend -m"Automatic build"
else
  git commit -m"Automatic build"
fi
git push origin master --force
