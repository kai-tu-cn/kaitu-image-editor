#!/bin/sh

git filter-branch --env-filter '

an="$GIT_AUTHOR_NAME"
am="$GIT_AUTHOR_EMAIL"
cn="$GIT_COMMITTER_NAME"
cm="$GIT_COMMITTER_EMAIL"

if [ "$GIT_COMMITTER_NAME" = "rolitter" ]
then
    cn="sco1314"
    an="sco1314"
fi

if [ "$GIT_COMMITTER_EMAIL" = "rolitter@gmail.com" ]
then
    cm="2421462516@qq.com"
    am="2421462516@qq.com"
fi

export GIT_AUTHOR_NAME="$an"
export GIT_AUTHOR_EMAIL="$am"
export GIT_COMMITTER_NAME="$cn"
export GIT_COMMITTER_EMAIL="$cm"

' HEAD

