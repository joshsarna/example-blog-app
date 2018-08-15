class V1::CommentsController < ApplicationController
  def index
    @comments = Comment.where(post_id: params[:post_id])
    render "index.json.jbuilder"
  end

  def create
    @comment = Comment.new(
      user_id: current_user.id,
      post_id: params[:post_id],
      text: params[:text]
    )
    @comment.save
    render "show.json.jbuilder"
  end
end
